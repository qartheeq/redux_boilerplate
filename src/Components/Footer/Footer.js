import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import "./Footer.css"

class Footer extends Component {
    render() {
        return (
            <div style={{ boxSizing: "border-box", padding: 10, borderTop: "1px solid lightgray", height: 100, backgroundColor: "#f1f1f1", justifyContent: "space-around", display: "flex" }}>

                <div>
                    <div style={{ fontWeight: "bold", marginBottom: 10, color: "gray" }}>Buy</div>
                    <NavLink
                        to={"/registration"}
                        exact
                        style={{
                            textDecoration: 'none',
                            color: "rgb(32, 32, 34)"

                        }}
                        activeStyle={{
                            color: "#4282ad",
                            textDecoration: "underline"
                        }}
                    >
                        <div className="footerItem">Registration</div>

                    </NavLink>
                    <NavLink
                        to={"/stores"}
                        exact
                        style={{
                            textDecoration: 'none',
                            color: "rgb(32, 32, 34)"

                        }}
                        activeStyle={{
                            color: "#4282ad",
                            textDecoration: "underline"
                        }}
                    >
                        <div className="footerItem">Stores</div>

                    </NavLink>
                </div>
                <div>
                    <div style={{ fontWeight: "bold", marginBottom: 10, color: "gray" }}>About us</div>
                    <NavLink
                        to={"/info"}
                        exact
                        style={{
                            textDecoration: 'none',
                            color: "rgb(32, 32, 34)"

                        }}
                        activeStyle={{
                            color: "#4282ad",
                            textDecoration: "underline"
                        }}
                    >
                        <div className="footerItem">Company Info</div>

                    </NavLink>
                </div>
                <div>
                    <div style={{ fontWeight: "bold", marginBottom: 10, color: "gray" }}>Social Media</div>
                    <a href="http://www.facebook.com"
                        target="blank"
                        style={{
                            textDecoration: 'none',
                            color: "rgb(32, 32, 34)"

                        }}
                    >
                        <div className="footerItem">Facebook</div>
                    </a>
                </div >


            </div >
        )
    }
}

export default Footer;
