import React, {Component, Fragment} from "react";
import "../scss/scorer.css";
import placeholder from "../../img/placeholder.png";

class Scorer extends Component {

    constructor() {
        super();

        this.state = {
            dismissed: false
        };
        this.renderParticipants = this.renderParticipants.bind(this);
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

    renderRoundScore(id) {
        return (
            <Fragment>
                {this.props.isScorer && <button className={"scoreUpdate remove"} onClick={() => {
                    this.props.updateRound({
                        target: id,
                        type: "REMOVE"
                    });
                }}>
                        -
                </button>}
                <div className={"roundScore"}><p>2</p></div>
                {this.props.isScorer && <button className={"scoreUpdate add"} onClick={() => {
                    this.props.updateRound({
                        target: id,
                        type: "ADD"
                    });
                }}>
                        +
                </button>}
            </Fragment>
        );
    }

    render(){
        console.log(this.props);
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
                        {this.renderRoundScore(1)}
                        <div className={"roundText"}><p>Round {this.props.finishedRounds.length + 1} / {this.props.totalRounds}</p></div>
                        {this.renderRoundScore(2)}
                    </div>
                    {(this.props.activeRound && !this.props.activeRound.finished) &&
                    <div className={"roundInformationsWrapper"}>
                        <h1 className={"roundTitle"}>
                            {this.props.activeRound.title}
                        </h1>
                        <p className={"roundDescription"}>
                            {this.props.activeRound.description}
                        </p>
                    </div>}
                    {(!this.props.activeRound || this.props.activeRound.finished) &&
                    <div className={"gameStatus"}>
                        <p>Status</p>
                    </div>}
                    <div className={"controlWrapper"}>
                        {(this.props.isStarted) && <div className={"startRoundWrapper"}>
                            <button className={"controlButton"} onClick={() => {
                                this.props.goNextRound({countDown: this.refs.roundCountDown.value});
                            }}>Start next round</button>
                            <p>in</p>
                            <input placeholder={"0"} type={"number"} ref={"roundCountDown"} />
                            <p>seconds</p>
                        </div>}
                        <div className={"otherWrapper"}>
                            {(this.props.isStarted) &&<button className={"controlButton"} onClick={() => {
                                this.props.finishRound();
                            }}>Finish Round</button>}
                            {(this.props.isStarted) && <button className={"controlButton"} onClick={() => {
                                this.props.prevRound();
                            }}>Previous Round</button>}
                            {(this.props.isStarted) &&<button className={"controlButton"} onClick={() => {
                                this.props.resetRound();
                            }}>Reset Round</button>}
                            {(!this.props.isStarted) &&  <button className={"controlButton"} onClick={() => {
                                this.props.startGame();
                            }}>Start Game</button>}
                            {(this.props.isStarted) && <button className={"controlButton"} onClick={() => {
                                this.props.endGame();
                            }}>End game</button>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Scorer;