import React, {Component} from "react";
import "../scss/scorer.css";

class Scorer extends Component {

    constructor() {
        super();

        this.state = {
            dismissed: false
        }
    }

    render(){ 
        if (this.state.dismissed) {
            return (<div className={"scorerPlaceHolder"} />);
        }
        return (
            <div className={"scorerWrapper"} >
                <div className="scorer">
                    <button className="dismissScore" onClick={() => {
                        this.setState({
                            dismissed: true
                        });
                    }}>
                        <i className="fas fa-times" />
                    </button>
                
                </div>
            </div>
        );
    }
}

export default Scorer;