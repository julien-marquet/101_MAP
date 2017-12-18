import React, {Component} from 'react';

class Seat extends Component {
    render() {
        if (this.props.user === undefined) {
            return (
                <div className={'seat'}>
                    <p>{this.props.hostname}</p>
                </div>
            );
        }
        else {
            return (
                <div className={'seat'}>
                    <img
                        src={`https://cdn.intra.42.fr/users/small_${this.props.user.user.login}.JPG`}
                        className={'userImg'}
                    />
                </div>
            )
        }
    }
}

export default Seat;
