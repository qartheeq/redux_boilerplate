import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Item from "../Item/Item"
import CircularProgress from '@material-ui/core/CircularProgress';
import "./ProductList.css"
import queryString from 'query-string'
import Api from "../../Api"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import PriceDialog from '../PriceDialog/PriceDialog';
import Paging from "../Paging/Paging"
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';



const sortOptions = [<MenuItem key={"lh"} value={"lh"}>Sort by price: low to high</MenuItem>, <MenuItem key={"hl"} value={"hl"}>Sort by price: high to low</MenuItem>]

// This component is responsible for retrieving the products it needs to show.
// It determines the kind of products it needs to show from query string.
// It checks the query string on first render and on every props change.
class ProductList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            unfinishedTasks: 0,
            openPriceDialog: false,
            minDraft: null,
            maxDraft: null,
            isDraft: false,
            itemsPerPage: null,
            wholeDataLength: null,
            items: []
        }

        this.getParamFromProps = this.getParamFromProps.bind(this);
        this.updateURLAndRedirect = this.updateURLAndRedirect.bind(this);
    }


    // Convert object to query string 
    objectToQueryString(params) {

        var esc = encodeURIComponent;
        var query = Object.keys(params)
            .map(k => esc(k) + '=' + esc(params[k] !== undefined ? params[k] : ""))
            .join('&');

        return query;
    }

    // As noted this component determines which products to load from query string.
    // This function is used to update the query string with new values.
    updateURLAndRedirect(newValues, restartPaging) {

        let currentQs = queryString.parse(this.props.location.search);
        let newQS = { ...currentQs, ...newValues };

        if (restartPaging) {
            delete newQS["page"];
        }

        this.props.history.push('/search/?' + this.objectToQueryString(newQS));

    }

    // Extract value of parameter with a given name from query string.
    // The query string itself is contained in passed props object.
    getParamFromProps(name, props = this.props) {
        let qs = queryString.parse(props.location.search);

        switch (name) {
            case 'category':
                return qs.category || "popular";
            case 'term':
                return qs.term || "";
            case 'page':
                return qs.page || "1";
            case 'minPrice':
                return qs.minPrice || "0";
            case 'maxPrice':
                return qs.maxPrice || "1000";
            case 'usePriceFilter':
                return qs.usePriceFilter === "true";
            case 'sortValue':
                return qs.sortValue || "lh";
            case 'directCategoryClick':
                return qs.term === undefined;
            default:
                return undefined;
        }

    }


    async fetchData(props = this.props) {

        this.setState((ps) => ({ unfinishedTasks: ps.unfinishedTasks + 1 }))


        // Make simulated request to server to get items 
        let results = await Api.searchItems({
            category: this.getParamFromProps("category", props),
            term: this.getParamFromProps("term", props),
            page: this.getParamFromProps("page", props),
            minPrice: this.getParamFromProps("minPrice", props),
            maxPrice: this.getParamFromProps("maxPrice", props),
            sortValue: this.getParamFromProps("sortValue", props),
            usePriceFilter: this.getParamFromProps("usePriceFilter", props),
        });

        this.setState((ps) => ({
            items: results.data,
            unfinishedTasks: ps.unfinishedTasks - 1,
            itemsPerPage: results.itemsPerPage,
            wholeDataLength: results.totalLength
        }));



    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillReceiveProps(nextProps) {
        this.fetchData(nextProps);
    }

    handleSortChange = (e) => {
        this.updateURLAndRedirect({ sortValue: e.value })
    }

    pageTitle() {
        let pageTitle;
        if (this.getParamFromProps("category") === "popular") {
            pageTitle = "Popular products";
        } else if (this.getParamFromProps("directCategoryClick")) {
            pageTitle = this.getParamFromProps("category");
        } else {
            pageTitle = "Search results";
        }
        return pageTitle;
    }

    render() {

        return (
            <div className="product-list">
                <div className="product-list-header">
                    <div className="online-shop-title" style={{flexGrow: 1}}>{this.pageTitle()}</div>
                    <div style={{ maxWidth: 500, marginTop: 5, display: "flex" }}>
                        <FormControlLabel
                            style={{ marginBottom: 5 }}
                            control={
                                <Checkbox
                                    color="primary"
                                    checked={this.getParamFromProps("usePriceFilter")}
                                    onChange={(e) => {
                                        this.updateURLAndRedirect({ usePriceFilter: e.target.checked }, true)
                                    }}
                                />
                            }
                            label="Filter by price"
                        />
                        {this.getParamFromProps("usePriceFilter") &&
                            <Tooltip title="Click to change range" disableFocusListener >
                                <Button
                                    variant="outlined"
                                    style={{ marginRight: 20, height: 10 }}
                                    onClick={() => {
                                        this.setState({ openPriceDialog: true })
                                    }}>{this.getParamFromProps("minPrice") + "$ - " + this.getParamFromProps("maxPrice") + "$"}
                                </Button>
                            </Tooltip>}
                        <Select
                            style={{ maxWidth: 400, marginBottom:10 }}
                            value={this.getParamFromProps("sortValue")}
                            MenuProps={{
                                style: {
                                    maxHeight: 500
                                }
                            }}
                            onChange={(e) => {
                                this.updateURLAndRedirect({ sortValue: e.target.value })
                            }}

                        >
                            {sortOptions}
                        </Select>
                    </div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ flex: 1 }}>
                        {this.state.unfinishedTasks !== 0 ?
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
                    {this.state.unfinishedTasks === 0 &&
                        <Paging
                            getParamFromProps={this.getParamFromProps}
                            updateURLAndRedirect={this.updateURLAndRedirect}
                            itemsPerPage={this.state.itemsPerPage}
                            wholeDataLength={this.state.wholeDataLength}
                        />}
                </div>
                <PriceDialog
                    open={this.state.openPriceDialog}
                    min={this.state.isDraft ? this.state.minDraft : this.getParamFromProps("minPrice")}
                    max={this.state.isDraft ? this.state.maxDraft : this.getParamFromProps("maxPrice")}
                    onChange={(min, max) => this.setState({ minDraft: min, maxDraft: max, isDraft: true })}
                    onSave={() => {
                        if (this.state.isDraft) {
                            // If we get here, user is trying to save the draft price. 
                            this.setState({ isDraft: false })
                            this.updateURLAndRedirect({ minPrice: this.state.minDraft, maxPrice: this.state.maxDraft }, true);
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
