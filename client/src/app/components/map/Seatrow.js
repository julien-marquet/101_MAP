import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Seat from './Seat';

class Seatrow extends Component {
  renderRow() {
    const seats = [...this.props.seats];
    seats.reverse();
    return seats.map((seatsRow, rowIndex) => {
      return (
        <div
          className={'seatRow'}
          style={this.props.vertical ? {flexDirection: 'column'} : {}}
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
        style={this.props.vertical ? {flexDirection: 'row'} : {}}
      >
        {this.renderRow()}
      </div>
    );
  }
}

Seatrow.proptypes = {
  seats: PropTypes.array.isRequired
};

export default Seatrow;
