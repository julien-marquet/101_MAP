import React, { Component } from "react";
import PropTypes from "prop-types";

class Coalitions extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"coalitionScore"}>
                <div className={"logoBackground"} style={{ backgroundColor: this.props.color }}>
                    <div>
                        <img src={this.props.image_url} style={{ marginTop: this.props.name.toLowerCase() === "ranger" ? "-12%" : "0" }} />
                    </div>
                </div>
                <p style={{color: this.props.color }}>{this.props.score}</p>
            </div>
        );
    }
}

Coalitions.propTypes = {
    id: PropTypes.number,
    color: PropTypes.string,
    image_url: PropTypes.string,
    name: PropTypes.string,
    score: PropTypes.number,
    slug: PropTypes.string,
    user_id: PropTypes.number
};

export default Coalitions;
