import {Button} from "reactstrap";
import {Link} from "react-router-dom";
import React from "react";

const Recipe = (props) => (
    <div className="recipe-container p-2 m-2 d-flex flex-column">
        <h3>{props.name}</h3>
        <div className="recipe-body">
            <div className="subtitle-container">
                <div>{props.instructions}</div>
            </div>
        </div>
        <div className="recipe-footer">
            <Button color="secondary" tag={Link} to={"/recipes/" + props.id}>Edit</Button>
            <Button color="danger" onClick={() => props.remove(props.id)}>Delete</Button>
        </div>
    </div>
);

export default Recipe