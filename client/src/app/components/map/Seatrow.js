import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";

import Seat from "../../containers/map/seat";
import config from "../../../config/globalConfig";

class Seatrow extends Component {
    constructor(props) {
        super(props);

        this.seats = [];
        this.seatRowStyle = {};
        this.rowWrapperStyle = {};
    }

    componentWillMount() {
        if (this.props.zone === "z3") {
            this.seatRowStyle.flexDirection = "column";
            this.rowWrapperStyle.flexDirection = "row-reverse";
        }
        this.seats = [...this.props.seats];
        Object.keys(config.teleporters).map(tp => {
            if (tp.includes(this.props.zone)) {
                this.seats[parseInt(tp.split("r")[1].split("p")[0], 10) - 1].push({isTp: true, pos: tp.substr(2)});
            }
        });
    }

    renderFromTo(from, to = null) {
        return this.seats.map((seatsRow, rowIndex) => {
            if (rowIndex >= from && (to === null || rowIndex < to)) {
                return this.renderSeat(seatsRow, rowIndex);
            }
            return null;
        });
    }

    renderSeat(seatsRow, rowIndex) {
        return (
            <div
                className={"seatRow"}
                style={this.seatRowStyle}
                key={`row${rowIndex + 1}`}
            >
                {seatsRow.map((seat, seatIndex) => {
                    return (
                        <Seat
                            key={`seat${seatIndex + 1}`}
                            hostname={`${this.props.zone}r${rowIndex + 1}p${seatIndex + 1}`}
                            user={this.props.users.array[`${this.props.zone}r${rowIndex + 1}p${seatIndex + 1}`]}
                            allUsers={this.props.users.array}
                            isTp={seat.isTp !== undefined}
                            // user={this.props.zone === "z2" &&  ( this.props.users.array[`${this.props.zone}r${rowIndex + 1}p${seatIndex + 1}`] === undefined || (this.props.users.array[`${this.props.zone}r${rowIndex + 1}p${seatIndex + 1}`] !== undefined && this.props.users.array[`${this.props.zone}r${rowIndex + 1}p${seatIndex + 1}`].user.login !== "legrivel")) ? undefined : this.props.users.array[`${this.props.zone}r${rowIndex + 1}p${seatIndex + 1}`]}
                        />
                    );
                })}
            </div>
        );
    }

    renderRow() {
        if (this.props.zone === "z1") {
            return (
                <Fragment>
                    <div className={"z1Container"}>{this.renderFromTo(0, 5)}</div>
                    <div className={"z1Container"}>{this.renderFromTo(5)}</div>
                </Fragment>
            );
        }
        return this.seats.map((seatsRow, rowIndex) => this.renderSeat(seatsRow, rowIndex));
    }

    render() {
        return (
            <div
                className={"rowWrapper"}
                style={this.rowWrapperStyle}
            >
                {this.renderRow()}
            </div>
        );
    }
}

Seatrow.proptypes = {
    seats: PropTypes.array.isRequired,
    zone: PropTypes.string.isRequired,
    users: PropTypes.object.isRequired
};

export default Seatrow;
