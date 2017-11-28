import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Seat from './Seat';

class Seatrow extends Component {
  constructor(props) {
    super(props);

    this.seatRowStyle = {};
    this.rowWrapperStyle = {};
  }

  componentWillMount() {
    if (this.props.zone == 'z3') {
      this.seatRowStyle.flexDirection = 'column';
      this.rowWrapperStyle.flexDirection = 'row';
    }
    else if (this.props.zone === 'z4') {
      this.seatRowStyle.justifyContent = 'flex-end';
    }
  }

  renderRow() {
    const seats = [...this.props.seats];
    seats.reverse();
    return seats.map((seatsRow, rowIndex) => {
      return (
        <div
          className={'seatRow'}
          style={this.seatRowStyle}
          key={`row${rowIndex}`}
        >
          {seatsRow.map((seat, seatIndex) => <Seat key={`seat${seatIndex}`} />)}
        </div>
      );
    });
  }

  render() {
    return (
      <div
        className={'rowWrapper'}
        style={this.rowWrapperStyle}
      >
        {this.renderRow()}
      </div>
    );
  }
}

Seatrow.proptypes = {
  seats: PropTypes.array.isRequired,
  zone: PropTypes.string.isRequired
};

export default Seatrow;
