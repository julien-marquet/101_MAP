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

    componentWillMount() {
        this.props.getScores();
    }

    render(){ 
        console.log(this.props)
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
                    <div className={"participantWrapper"}>
                        <div className={"participantBlock win"}>
                            <img src={placeholder} />
                            <div className={"participantLogin"}>
                                <p>Jean-patrick</p>
                            </div>
                            <div className={"participantScore"}>
                                <p> 101</p>
                            </div>
                        </div>
                        <div className={"participantBlock loose"}>
                            <img src={placeholder} />
                            <div className={"participantLogin"}>
                                <p>Kim jung-hun</p>
                            </div>
                            <div className={"participantScore"}>
                                <p>42</p>
                            </div>
                        </div>
                    </div>
                    <p className={"participantsStatus"}>Jean Patrick is winning !</p>
                </div>
            </div>
        );
    }
}

export default Scorer;