import React, { Component } from 'react';
import "./Menu.css";
import { NavLink } from 'react-router-dom'
import queryString from 'query-string'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'
import { categoryNames } from "../../Data"

const mapStateToProps = state => {
    return { show: state.showMenu, checkedOutItems: state.checkedOutItems, loggedInUser: state.loggedInUser };
};

// Generates menu data. Some menu items are hardcoded, some derived from categories.
const generateMenuModel = (categories) => {
    let menuModel = [
        { type: "title", name: "MAIN", id: 0 },
        { type: "item", name: "Home page", url: "/", parent: "MAIN", id: 1 },
        { type: "item", name: "About us", url: "/about", parent: "MAIN", id: 2 },
        { type: "title", name: "CATEGORIES", id: 3 },
    ];

    menuModel = menuModel.concat(categories.map((x, i) => {
        return {
            name: x, url: "/search/?category=" + x, id: 4 + i, type: "item", parent: "CATEGORIES"
        }
    }))

    return menuModel;
}


// This component renders a menu.
class ConnectedMenu extends Component {

    constructor(props) {
        super(props);

        let menuItems = generateMenuModel(categoryNames);

        // Default expand all title items in menu 
        let initialExpandedState = {};
        menuItems.forEach(y => {
            if (y.type === "title") initialExpandedState[y.name] = true;
        })

        this.state = {
            expanded: initialExpandedState,
            menuItems
        }

    }
    render() {
        if (!this.props.show) return null;
        return (
            <div className="menu">
                {

                    this.state.menuItems.filter(y => {

                        // For a menu item to be visible, it must either be a title (has no parent),
                        // or be in expanded state and plus user must be allowed to see it.                        
                        return (y.parent === undefined || (this.state.expanded[y.parent] && (!y.protected || this.props.loggedInUser)));
                    }).map((x, i) => {

                        if (x.type === "item") {

                            return (<div key={x.id} style={{ margin: 5 }}>
                                <NavLink
                                    to={x.url}
                                    exact
                                    isActive={(_, location) => {

                                        // In case current URL contains a query string we do some manual
                                        // checks to determine if the navlink should be in active style or not.
                                        if (location.search) {
                                            let itemCategory = queryString.parse(x.url.substring(x.url.indexOf("?"))).category;

                                            let currectCategory = queryString.parse(location.search).category;
                                            let directClick = queryString.parse(location.search).term === undefined;

                                            return directClick && itemCategory === currectCategory;
                                        }
                                        return x.url === location.pathname;
                                    }}
                                    style={{
                                        textDecoration: 'none',
                                        color: "rgb(32, 32, 34)"

                                    }}
                                    activeStyle={{
                                        fontWeight: 'bold',
                                        color: "#4282ad"
                                    }}
                                >
                                    <div className="menuItem">{x.name}</div>
                                </NavLink></div>);
                        } else if (x.type === "title") {
                            return (<div
                                key={x.id}
                                onClick={() => {

                                    // Either expand or collapse this title item 
                                    this.setState(ps => {
                                        return {
                                            expanded: {
                                                ...ps.expanded,
                                                [x.name]: !ps.expanded[x.name]
                                            }
                                        }
                                    })
                                }}
                                style={{ height: 30, color: "gray", marginLeft: 10, marginTop: 20, fontSize: 14 }}>
                                {this.state.expanded[x.name] ?
                                    <i className="far fa-minus-square" style={{ marginRight: 5 }}></i> :
                                    <i className="far fa-plus-square" style={{ marginRight: 5 }}></i>
                                }
                                <span>{x.name}</span>

                            </div>);
                        }

                        return null;

                    })}

            </div>


        );
    }
}
const Menu = withRouter(connect(mapStateToProps)(ConnectedMenu));
export default Menu;
