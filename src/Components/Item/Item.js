import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { connect } from "react-redux";
import { addItemInCart } from "../../Redux/Actions"
import { withRouter } from "react-router-dom";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Tooltip from '@material-ui/core/Tooltip';

class ConnectedItem extends Component {
    render() {
        return (
            <Card style={{ width: 200, height: 270, margin: 10, display: "inline-block" }}>
                <CardActionArea onClick={() => {
                    this.props.history.push('/details/' + this.props.item.id);
                }}>
                    <CardMedia
                        style={{ height: 140 }}
                        image={this.props.item.imageURL}
                    />
                    <CardContent style={{ height: 50 }}>
                        <div style={{ margin: 5, color: "gray", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{this.props.item.name}</div>
                        <div style={{ margin: 5 }}>Price: {this.props.item.price} $</div>
                        <div style={{ color: "#4282ad", margin: 5 }}>{this.props.item.popular && "Popular"}</div>

                    </CardContent>
                </CardActionArea>
                <CardActions style={{ paddingBottom: 25, position: "relative" }}>
                    <Tooltip title="Add to cart">
                        <IconButton style={{ position: "absolute", right: 0, bottom: -15 }} onClick={(e) => {
                            e.stopPropagation();
                            this.props.dispatch(addItemInCart({ ...this.props.item, quantity: 1 }));
                        }} color="primary" aria-label="Add to shopping cart">
                            <AddShoppingCartIcon />
                        </IconButton>
                    </Tooltip>
                </CardActions>
            </Card>
        )
    }
}

export default withRouter(connect()(ConnectedItem));
