import React, { Component } from 'react';
import "./Details.css";
import Button from '@material-ui/core/Button';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import CircularProgress from '@material-ui/core/CircularProgress';
import { addItemInCart } from "../../Redux/Actions"
import Api from "../../Api"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Item from "../Item/Item";
import { connect } from "react-redux";
var Remarkable = require('remarkable');


class ConnectedDetails extends Component {

    state = {
        relatedItems: [],
        item: null,
        loading: true,
    }

    fetch(id) {
 
        this.setState({ loading: true })
        
        /* First, let's get the item */
        Api.getItemUsingID(id).then((data) => {
            this.setState({ item: data })
            
            /* Now, get related items */
            return Api.searchData({ category: data.category })
        }).then((res) => {
            this.setState((ps) => {
                return {
                    loading: false,
                    relatedItems: res.filter((x, i) => x.id !== ps.item.id && i < 10)
                }
            })

        })

    }

    componentWillReceiveProps(nextProps) {
        let id = parseInt(nextProps.match.params.id, 10);
        this.fetch(id);
    }

    componentDidMount() {

        /* ID of item we want to show details for is embedded in URL, retrieve it. */
        let id = parseInt(this.props.match.params.id, 10);
        this.fetch(id);
    }

    getRawMarkup(data) {
        const md = new Remarkable();
        return { __html: md.render(data) };
    }

    render() {

        const sliderSettings = {
            dots: true,
            infinite: this.state.relatedItems.length >= 3,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1
        };


        /* If data hasn't arrived, yet, only show progress control. */
        if (this.state.loading) {
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
                            {this.state.item.inStock ?
                                <span style={{ color: "#0a7f19", marginTop: 5, fontSize: 14 }}> In Stock</span> :
                                <span style={{ color: "red", marginTop: 5, fontSize: 14 }}>Not in Stock</span>}
                            {this.state.item.popular && <span style={{ marginTop: 5, color: "gray", fontSize: 14 }}> | Popular</span>}

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

                    {this.state.relatedItems.length !== 0 &&
                        <Slider {...sliderSettings}>
                            {this.state.relatedItems.map((item) => {
                                return (
                                    <Item
                                        mini={true}
                                        key={item.id}
                                        item={item}
                                    />
                                )
                            })}
                        </Slider>}
                </div>

            </div>


        );
    }
}

let Details = connect()(ConnectedDetails);
export default Details;
