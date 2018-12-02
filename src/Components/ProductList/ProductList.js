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
import TextField from '@material-ui/core/TextField';

/*
 * This component is responsible for retrieving the products it needs to show.
 * It determines the kind of products it needs to show from query string.
 * It checks the query string on first render and on every props change.
 *
 */
class ProductList extends Component {


    state = {
        unfinishedTasks: false,
        openPriceDialog: false,
        minDraft: null,
        maxDraft: null,
        isDraft: false,
        itemsPerPage: null,
        wholeDataLength: null,
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

    /* 
     * Update existing query string with parameters from newValues and redirect to that URL.
     * If parameter: restartPaging is true, we will remove element "page" from query string.
     */
    updateURLAndRedirect(newValues, restartPaging) {

        let currentQs = queryString.parse(this.props.location.search);
        let newQS = { ...currentQs, ...newValues };

        if (restartPaging) {
            delete newQS["page"];
        }

        this.props.history.push('/search/?' + this.objectToQueryString(newQS));

    }

    /* 
     * Extract parameter with given name from query string.
     * The query string itself is contained in passed props object.
     */
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
            case 'directCategory':
                return qs.directCategory === "true";
            default:
                return undefined;
        }

    }


    fetchData(props = this.props) {

        this.setState((ps) => ({ unfinishedTasks: ps.unfinishedTasks + 1 }))

        /* Make simulated request to server to get products */
        Api.searchData({
            category: this.getParamFromProps("category", props),
            term: this.getParamFromProps("term", props),
            page: this.getParamFromProps("page", props),
            minPrice: this.getParamFromProps("minPrice", props),
            maxPrice: this.getParamFromProps("maxPrice", props),
            sortValue: this.getParamFromProps("sortValue", props),
            usePriceFilter: this.getParamFromProps("usePriceFilter", props),
        }).then((data) => {
            this.setState((ps) => ({
                items: data.data,
                unfinishedTasks: ps.unfinishedTasks - 1,
                itemsPerPage: data.itemsPerPage,
                wholeDataLength: data.totalLength
            }))
        })

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

    /* Determine page title */
    pageTitle() {
        let pageTitle;
        if (this.getParamFromProps("category") === "popular") {
            pageTitle = "Popular products";
        } else if (this.getParamFromProps("directCategory")) {
            pageTitle = this.getParamFromProps("category");
        } else {
            pageTitle = "Search results";
        }
        return pageTitle;
    }

    render() {

        /* Compute total number of pages. */
        let totalPages = Math.ceil(this.state.wholeDataLength / this.state.itemsPerPage);

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
                                onChange={this.handleSortChange} value={this.getParamFromProps("sortValue")} />
                        </div>

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
                        <FormControlLabel
                            style={{ marginBottom: 5 }}
                            control={
                                <Checkbox
                                    color="primary"
                                    checked={this.getParamFromProps("usePriceFilter")}
                                    style={{ marginBottom: 5 }}
                                    onChange={(e) => {
                                        this.updateURLAndRedirect({ usePriceFilter: e.target.checked }, true)
                                    }}
                                />
                            }
                            label="Filter by price"
                        />
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
                    {/* Paging component */}
                    {this.state.unfinishedTasks === 0 &&
                        <div style={{ fontSize: 12, color: "gray", fontWeight: "bold", height: 30, borderTop: "1px solid lightgray", padding: 10, display: "flex" }}>
                            <div>
                                <Button variant="outlined"
                                    size="small"
                                    color="primary"
                                    disabled={this.getParamFromProps("page") === "1"}
                                    onClick={() => {
                                        this.updateURLAndRedirect({ page: 1 });
                                    }}
                                    style={{ marginRight: 10 }}>{"First"}</Button>
                                <Button variant="outlined"
                                    size="small"
                                    color="primary"
                                    disabled={this.getParamFromProps("page") === "1"}
                                    onClick={() => {
                                        let val = parseInt(this.getParamFromProps("page"), 0) - 1;
                                        this.updateURLAndRedirect({ page: val });
                                    }}
                                    style={{ marginRight: 10 }}>{"Previous"}</Button>
                                Page:
                              <TextField type="number"
                                    variant="outlined"
                                    value={this.getParamFromProps("page")}
                                    style={{ width: 70, fontWeight: "normal", height: 33, marginLeft: 5, marginRight: 5 }}
                                    onChange={(e) => {
                                        let val = e.target.value;
                                        if (parseInt(val, 0) > totalPages || parseInt(val, 0) < 1)
                                            return;
                                        this.updateURLAndRedirect({ page: val });

                                    }}></TextField>
                                of {totalPages}
                                <Button
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    disabled={this.getParamFromProps("page") === totalPages.toString()}
                                    onClick={() => {
                                        let val = parseInt(this.getParamFromProps("page"), 0) + 1;
                                        this.updateURLAndRedirect({ page: val });
                                    }}
                                    style={{ marginLeft: 10, marginRight: 10 }}>{"Next"}</Button>
                                <Button variant="outlined"
                                    size="small"
                                    color="primary"
                                    disabled={this.getParamFromProps("page") === totalPages.toString()}
                                    onClick={() => {
                                        this.updateURLAndRedirect({ page: totalPages });
                                    }}
                                    style={{ marginRight: 10 }}>{"Last"}</Button>
                            </div>
                            <div style={{ fontSize: 12, color: "gray", fontWeight: "bold", marginTop: 10, flex: 1, textAlign: "right" }}>
                                <span style={{ marginLeft: 10 }}> Items per page: {this.state.itemsPerPage} </span>
                                <span> Total items: {this.state.wholeDataLength}</span>
                            </div>
                        </div>}
                </div>
                <PriceDialog
                    open={this.state.openPriceDialog}
                    min={this.state.isDraft ? this.state.minDraft : this.getParamFromProps("minPrice")}
                    max={this.state.isDraft ? this.state.maxDraft : this.getParamFromProps("maxPrice")}
                    onChange={(min, max) => this.setState({ minDraft: min, maxDraft: max, isDraft: true })}
                    onSave={() => {
                        if (this.state.isDraft) {
                            /* If we get here, user is trying to save the draft price. */
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
