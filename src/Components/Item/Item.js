import React, { Component } from 'react';
import "./Item.css";
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { connect } from "react-redux";
import { addItemInCart } from "../../Redux/Actions"
import { withRouter } from "react-router-dom";


// This is a card like component which shows info about single product (e.g. when you see search result of products).
class ConnectedItem extends Component {

    render() {
        return (
            <div className="item" style={{ height: "270px", width: "200px" }} onClick={() => {
                this.props.history.push('/details/' + this.props.item.id);
            }}>
                <div style={{ color: "gray", margin: 5, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{this.props.item.name}</div>
                <div style={{ height: 160, width: 160, marginLeft: 20 }}>  <img alt={this.props.item.name} height={160} width={160} src={this.props.item.imageURL} /> </div>
                <div style={{ color: "gray", float: "left", margin: 10, fontSize: 16 }}>Price: {this.props.item.price} $</div>
                <div style={{ color: "gray", float: "right", margin: 10, fontSize: 13 }}>{this.props.item.popular && "Popular"}</div>

                <div className="details-btn-div">
                    <Button onClick={(e) => {
                        e.stopPropagation();
                        this.props.history.push('/details/' + this.props.item.id);
                    }}>
                        Details
                    </Button>
                </div>
                <div className="add-btn-div">
                    <IconButton onClick={(e) => {
                        e.stopPropagation();
                        this.props.dispatch(addItemInCart({ ...this.props.item, quantity: 1 }));
                    }} color="primary" aria-label="Add to shopping cart">
                        <AddShoppingCartIcon />
                    </IconButton>
                </div>
            </div>


        );
    }
}

export default withRouter(connect()(ConnectedItem));
