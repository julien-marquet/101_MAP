import React, {Component} from "react";
import "../scss/scorer.css";
import placeholder from "../../img/placeholder.png";

class Scorer extends Component {

    constructor() {
        super();

        this.state = {
            dismissed: false
        };
        //this.renderParticipants = this.renderParticipants.bind(this);
    }

    componentWillMount() {
        this.props.getGame();
    }

    renderParticipants() {
        return this.props.participants.map(participant => {
            return (
                <div key={`participant${participant.id}`} className={"participant"}>
                    <div className={"participantLogin"}>
                        <p>
                            BODO
                        </p>
                    </div>
                    <img src={placeholder} />
                </div>
            );
        });
    }

    render(){ 
        if (this.state.dismissed || !(this.props.isStarted || this.props.isScorer)) {
            return (<div className={"scorerPlaceHolder"} />);
        }
        return (
            <div className={"scorerWrapper"} >
                <button className="dismissScore" onClick={() => {
                    this.setState({
                        dismissed: true
                    });
                }}>
                    <i className="fas fa-times" />
                </button>
                <div className={"scorer"}>
                    <div className={"globalScoresWrapper scoresWrapper"}>
                        <div className={"globalScore"}><p>5</p></div>
                        <div className={"globalText"}><p>Scores</p></div>
                        <div className={"globalScore"}><p>10</p></div>
                    </div>
                    <div className={"participantsWrapper"}>
                        {this.renderParticipants()}
                        <span className={"versus"}><p>Vs</p></span>
                    </div>
                    <div className={"roundScoresWrapper scoresWrapper"}>
                        <div className={"roundScore"}><p>2</p></div>
                        <div className={"roundText"}><p>Round 4 / 12</p></div>
                        <div className={"roundScore"}><p>1</p></div>
                    </div>
                    <div className={"roundInformationsWrapper"}>
                        <h1 className={"roundTitle"}>
                            Titre du round
                        </h1>
                        <p className={"roundDescription"}>
                            Et est admodum mirum videre plebem innumeram mentibus ardore quodam infuso cum dimicationum curulium eventu pendentem. haec similiaque memorabile nihil vel serium agi Romae permittunt. ergo redeundum ad textum.
                        </p>
                    </div>
                    <div className={"controlWrapper"}>
                        <div className={"startRoundWrapper"}>
                            <button className={"controlButton"}>Start next round</button>
                            <p>in</p>
                            <input placeholder={"0"} type={"number"} ref={"roundCountDown"} />
                            <p>seconds</p>
                        </div>
                        <div className={"otherWrapper"}>
                            <button className={"controlButton"}>Finish Round</button>
                            <button className={"controlButton"}>Previous Round</button>
                            <button className={"controlButton"}>Reset Round</button>
                            <button className={"controlButton"}>Start Game</button>
                            <button className={"controlButton"}>End game</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Scorer;