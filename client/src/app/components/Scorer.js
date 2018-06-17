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
                            <div className={"concurrentLogin"}>
                                <p>Jean-patrick</p>
                            </div>
                            <div className={"concurrentScore"}>
                                <p> 101</p>
                            </div>
                        </div>
                        <div className={"concurrentBlock loose"}>
                            <img src={placeholder} />
                            <div className={"concurrentLogin"}>
                                <p>Kim jung-hun</p>
                            </div>
                            <div className={"concurrentScore"}>
                                <p>42</p>
                            </div>
                        </div>
                    </div>
                    <p className={"concurrentsStatus"}>Jean Patrick is winning !</p>
                </div>
            </div>
        );
    }
}

export default Scorer;