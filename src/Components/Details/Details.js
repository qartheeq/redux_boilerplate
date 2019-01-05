import React, { Component } from 'react';
import "./Details.css";
import Button from '@material-ui/core/Button';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import CircularProgress from '@material-ui/core/CircularProgress';
import { addItemInCart } from "../../Redux/Actions"
import Api from "../../Api"
import Item from "../Item/Item";
import { connect } from "react-redux";
 var Remarkable = require('remarkable');


class ConnectedDetails extends Component {

    state = {
        relatedItems: [],
        item: null,
        unfinishedTasks: 0,
    }

    async fetchProductUsingID(id) {

        this.setState((ps) => ({ unfinishedTasks: ps.unfinishedTasks + 1 }))

        // First, let's get the item, details of which we want to show. 
        let item = await Api.getItemUsingID(id);

        // Now, we can get related items too. 
        let relatedItems = await Api.searchItems({ category: item.category });

        this.setState((ps) => {
            return {
                item,
                unfinishedTasks: ps.unfinishedTasks - 1,
                relatedItems: relatedItems.data.filter((x, i) => x.id !== item.id && i < 10)
            }
        })


    }

    componentWillReceiveProps(nextProps) {
        this.fetchProductUsingID(parseInt(nextProps.match.params.id, 10));
    }

    componentDidMount() {     
        this.fetchProductUsingID(parseInt(this.props.match.params.id, 10));
    }

    getRawMarkup(data) {
        const md = new Remarkable();
        return { __html: md.render(data) };
    }

    render() {

        // If data hasn't arrived, yet, only show progress control. 
        if (this.state.unfinishedTasks !== 0 || !this.state.item) {
            return (<CircularProgress className="circular" />)
        }


        return (
            <div className="details-page">

                <div className="details-page-header">
                    <div className="online-shop-title-smaller">{this.state.item.name}</div>
                </div>
                <div className="details-page-content">
                    <div style={{ margin: 5, width: 290, height: 290, padding: 2, border: "1px solid lightgray", borderRadius: 5 }}>
                        <img alt={this.state.item.name} style={{ borderRadius: 5 }} src={this.state.item.imageURL} height={290} width={290} />
                    </div>
                    <div style={{ flex: 1, marginLeft: 30, display: "flex", flexDirection: "column" }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 20, fontWeight: "bold", color: "#4282ad" }}>Price: {this.state.item.price} $</div>
                            {this.state.item.popular && <span style={{ marginTop: 5, color: "gray", fontSize: 14 }}> Popular product</span>}

                            <div style={{ marginTop: 35 }}>
                                <Button color="primary" variant="outlined"
                                    onClick={() => {
                                        this.props.dispatch(addItemInCart({ ...this.state.item, quantity: 1 }));
                                    }}>
                                    Add to Cart
                                 <AddShoppingCartIcon style={{ marginLeft: 5 }} />
                                </Button>
                            </div>
                        </div>
                        <div style={{ fontWeight: "bold", fontSize: 16 }}>Description</div>
                        <div style={{ flex: 1, maxHeight: 200, fontSize: 14, overflow: "auto" }} dangerouslySetInnerHTML={this.getRawMarkup(this.state.item.description)}></div>

                    </div>


                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div className="online-shop-title-smaller">Related Items {this.state.relatedItems.length === 0 ? "(N/A)" : ""}</div>

                    <div style={{
                        overflow: "auto",
                        whiteSpace: "nowrap",
                        marginTop:20,
                        width: "100%",
                    }} cols={3}>
                        {this.state.relatedItems.map(item => (
                            <span key={item.id} style={{ marginLeft: 50, marginRight: 50 }}>
                                <Item
                                    item={item}
                                />
                            </span>
                        ))}
                    </div>
                </div>
            </div>


        );
    }
}

let Details = connect()(ConnectedDetails);
export default Details;
