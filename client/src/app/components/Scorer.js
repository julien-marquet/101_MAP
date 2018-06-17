import React, {Component} from "react";
import "../scss/scorer.css";
import placeholder from "../../img/placeholder.png";

class Scorer extends Component {

    constructor() {
        super();

        this.state = {
            dismissed: false
        };
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
                    <div className={"concurrentWrapper"}>
                        <div className={"concurrentBlock win"}>
                            <img src={placeholder} />
                            <p className={"concurrentLogin"}>Jean-patrick</p>
                            <p className={"scoreLabel"}>Score :</p>
                            <div className={"scoreBlock"}>
                                101
                            </div>
                            <div className={"concurrentStatus"}>
                                <p>Win</p>
                            </div>
                        </div>
                        <div className={"concurrentBlock loose"}>
                            <img src={placeholder} />
                            <p className={"concurrentLogin"}>Kimberlay</p>
                            <p className={"scoreLabel"}>Score :</p>
                            <div className={"scoreBlock"}>
                                42
                            </div>
                            <div className={"concurrentStatus"}>
                                <p>Loose</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Scorer;