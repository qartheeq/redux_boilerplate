import React from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


// Paging component.
const Paging = (props) => {

    // Compute total number of pages. 
    let totalPages = Math.ceil(props.wholeDataLength / props.itemsPerPage);

    // We only render the paging component when there is need for it. 
    if (totalPages <= 1) return null;

    return (
        <div style={{ fontSize: 12, color: "gray", fontWeight: "bold", height: 30, borderTop: "1px solid lightgray", padding: 10, display: "flex" }}>
            <div>
                <Button variant="outlined"
                    size="small"
                    color="primary"
                    disabled={props.getParamFromProps("page") === "1"}
                    onClick={() => {
                        props.updateURLAndRedirect({ page: 1 });
                    }}
                    style={{ marginRight: 10 }}>{"First"}</Button>
                <Button variant="outlined"
                    size="small"
                    color="primary"
                    disabled={props.getParamFromProps("page") === "1"}
                    onClick={() => {
                        let val = parseInt(props.getParamFromProps("page"), 0) - 1;
                        props.updateURLAndRedirect({ page: val });
                    }}
                    style={{ marginRight: 10 }}>{"Previous"}</Button>
                Page:
                 <TextField type="number"
                    variant="outlined"
                    value={props.getParamFromProps("page")}
                    style={{ width: 70, fontWeight: "normal", height: 33, marginLeft: 5, marginRight: 5 }}
                    onChange={(e) => {
                        let val = e.target.value;
                        if (parseInt(val, 0) > totalPages || parseInt(val, 0) < 1)
                            return;
                        props.updateURLAndRedirect({ page: val });

                    }}></TextField>
                of {totalPages}
                <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    disabled={props.getParamFromProps("page") === totalPages.toString()}
                    onClick={() => {
                        let val = parseInt(props.getParamFromProps("page"), 0) + 1;
                        props.updateURLAndRedirect({ page: val });
                    }}
                    style={{ marginLeft: 10, marginRight: 10 }}>{"Next"}</Button>
                <Button variant="outlined"
                    size="small"
                    color="primary"
                    disabled={props.getParamFromProps("page") === totalPages.toString()}
                    onClick={() => {
                        props.updateURLAndRedirect({ page: totalPages });
                    }}
                    style={{ marginRight: 10 }}>{"Last"}</Button>
            </div>
            <div style={{ fontSize: 12, color: "gray", fontWeight: "bold", marginTop: 10, flex: 1, textAlign: "right" }}>
                <span style={{ marginLeft: 10 }}> Items per page: {props.itemsPerPage} </span>
                <span style={{ marginLeft: 10 }}> Total items: {props.wholeDataLength} </span>

            </div>
        </div>
    )
}

export default Paging;