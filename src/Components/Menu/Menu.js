import React, { Component } from 'react';
import "./Menu.css";
import { NavLink } from 'react-router-dom'
import queryString from 'query-string'
import { menuItems } from "../../Data"
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'

const mapStateToProps = state => {
    return { show: state.showMenu, checkedOutItems: state.checkedOutItems, loggedInUser: state.loggedInUser };
};

// This component renders a menu.
class ConnectedMenu extends Component {

    constructor(props) {
        super(props);

        // Default expand all title items in menu 
        let defaultExpanded = {};
        menuItems.forEach(y => {
            if (y.type === "title") defaultExpanded[y.name] = true;
        })

        this.state = {
            expanded: defaultExpanded
        }

    }
    render() {
        if (!this.props.show) return null;
        return (
            <div className="menu">
                {

                    menuItems.filter(y => {

                        // For an item to be shown it must either be a title (has no parent),
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
                                            let isDirect = queryString.parse(location.search).directCategory === "true";

                                            return isDirect && itemCategory === currectCategory;
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
