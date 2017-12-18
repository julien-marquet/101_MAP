import React, {Component} from 'react';

class Seat extends Component {
    constructor(props) {
        super(props);

        this.addDefaultSrc = this.addDefaultSrc.bind(this);
    }
    addDefaultSrc(ev) {
        if(this.props.user !== undefined && ev.target.src != `https://cdn.intra.42.fr/users/small_${this.props.user.user.login}.jpg`)
		    ev.target.src = `https://cdn.intra.42.fr/users/small_${this.props.user.user.login}.jpg`
	}	
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
                        onError={this.addDefaultSrc}
                        src={`https://cdn.intra.42.fr/users/small_${this.props.user.user.login}.JPG`}
                        className={'userImg'}
                    />
                </div>
            )
        }
    }
}

export default Seat;
