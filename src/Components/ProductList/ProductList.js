import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Item from "../Item/Item"
import CircularProgress from '@material-ui/core/CircularProgress';
import "./ProductList.css"
import queryString from 'query-string'
import Dropdown from 'react-dropdown'
import Api from "../../Api"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import PriceDialog from '../PriceDialog/PriceDialog';

/*
 * Initially when this component is rendered it consults the query
 * string on which products to retrieve and then does a simulated
 * request to server based on that; it repeats this action also on any props change.
 * 
 */
class ProductList extends Component {

    constructor(props) {
        super(props);

        /* We use this to avoid some race condition related issues, see below. */
        this.fetchId = 0;
    }

    state = {
        loading: false,
        openPriceDialog: false,
        minDraft: null,
        maxDraft: null,
        isDraft: false,
        items: []
    }



    /* Convert given object to query string */
    objectToQueryString(params) {

        var esc = encodeURIComponent;
        var query = Object.keys(params)
            .map(k => esc(k) + '=' + esc(params[k] !== undefined ? params[k] : ""))
            .join('&');

        return query;
    }

    /* Update existing URL with new parameters contained within passed object. */
    updateURL(newObject) {

        let qs = queryString.parse(this.props.location.search);
        let newUrl = { ...qs, ...newObject };
        this.props.history.push('/search/?' + this.objectToQueryString(newUrl));

    }

    /* 
     * Extract parameter with given name from query string.
     * If newProps is provided, query string is taken from newProps, otherwise from current props.
     */
    getParamFromURL(name, newProps) {
        let qs = queryString.parse(newProps ? newProps.location.search : this.props.location.search);

        switch (name) {
            case 'category':
                return qs.category || "popular";
            case 'term':
                return qs.term || "";
            case 'minPrice':
                return qs.minPrice || "0";
            case 'maxPrice':
                return qs.maxPrice || "1000";
            case 'usePriceFilter':
                return qs.usePriceFilter === "true";
            case 'sortValue':
                return qs.sortValue || "lh";
            case 'directCategory':
                return qs.directCategory === "true";
            default:
                return undefined;
        }

    }


    fetchData(newProps) {

        this.setState({ loading: true })

        this.fetchId++;

        let id = this.fetchId;

        Api.searchData({
            category: this.getParamFromURL("category", newProps),
            term: this.getParamFromURL("term", newProps),
            minPrice: this.getParamFromURL("minPrice", newProps),
            maxPrice: this.getParamFromURL("maxPrice", newProps),
            sortValue: this.getParamFromURL("sortValue", newProps),
            usePriceFilter: this.getParamFromURL("usePriceFilter", newProps),
        }).then((data) => {

            /* 
             * Without this check if user made one request and then quickly
             * another, you would temporarily see results from first request
             * on screen anyway.
             */
            if (id !== this.fetchId) return;

            this.setState({ loading: false, items: data })
        })

    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillReceiveProps(nextProps) {
        this.fetchData(nextProps);
    }

    handleSortChange = (e) => {
        this.updateURL({ sortValue: e.value })
    }

    /* Determine page title */
    pageTitle() {
        let pageTitle;
        if (this.getParamFromURL("category") === "popular") {
            pageTitle = "Popular products";
        } else if (this.getParamFromURL("directCategory")) {
            pageTitle = this.getParamFromURL("category");
        } else {
            pageTitle = "Search results";
        }
        return pageTitle;
    }

    render() {


        return (
            <div className="product-list">
                <div className="product-list-header">
                    <div className="online-shop-title">{this.pageTitle()}</div>
                    <div style={{ width: 500, marginTop: 5, display: "flex", flexGrow: 1, flexDirection: "row-reverse" }}>

                        <div style={{ width: 250 }}>
                            <Dropdown
                                options={[
                                    { value: 'lh', label: 'Sort by price: Low to High' },
                                    { value: 'hl', label: 'Sort by price: High to Low' },
                                ]}
                                className='react-dropdown'
                                onChange={this.handleSortChange} value={this.getParamFromURL("sortValue")} />
                        </div>

                        {this.getParamFromURL("usePriceFilter") &&
                            <Tooltip title="Click to change range" disableFocusListener >
                                <Button
                                    variant="outlined"
                                    style={{ marginRight: 20, height: 10 }}
                                    onClick={() => {
                                        this.setState({ openPriceDialog: true })
                                    }}>{this.getParamFromURL("minPrice") + "$ - " + this.getParamFromURL("maxPrice") + "$"}
                                </Button>
                            </Tooltip>}
                        <FormControlLabel
                            style={{ marginBottom: 5 }}
                            control={
                                <Checkbox
                                    color="primary"
                                    checked={this.getParamFromURL("usePriceFilter")}
                                    style={{ marginBottom: 5 }}
                                    onChange={(e) => {
                                        this.updateURL({ usePriceFilter: e.target.checked })
                                    }}
                                />
                            }
                            label="Filter by price"
                        />
                    </div>
                </div>
                <div>
                    {this.state.loading ?
                        <CircularProgress className="circular" /> :
                        this.state.items.map(item => {
                            return (
                                <Item
                                    key={item.id}
                                    item={item}
                                />
                            )
                        })}
                </div>
                <PriceDialog
                    open={this.state.openPriceDialog}
                    min={this.state.isDraft ? this.state.minDraft : this.getParamFromURL("minPrice")}
                    max={this.state.isDraft ? this.state.maxDraft : this.getParamFromURL("maxPrice")}
                    onChange={(min, max) => this.setState({ minDraft: min, maxDraft: max, isDraft: true })}
                    onSave={() => {
                        if (this.state.isDraft) {
                            /* If we get here, user is trying to save the draft price. */
                            this.setState({ isDraft: false })
                            this.updateURL({ minPrice: this.state.minDraft, maxPrice: this.state.maxDraft });
                        }
                        this.setState({ openPriceDialog: false })
                    }}
                    onClose={() => this.setState({ openPriceDialog: false, isDraft: false })}
                />

            </div>


        );
    }
}

export default ProductList;
