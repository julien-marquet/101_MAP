import React, {Component, Fragment} from "react";
import "../scss/scorer.css";
import placeholder from "../../img/placeholder.png";
import CountDown from "../components/CountDown.js";

class Scorer extends Component {

    constructor() {
        super();

        this.state = {
            dismissed: false
        };
        this.renderParticipants = this.renderParticipants.bind(this);
        this.renderRoundScore = this.renderRoundScore.bind(this);
        this.renderGlobalScore = this.renderGlobalScore.bind(this);
        this.getStatus = this.getStatus.bind(this);
        this.matchId = this.matchId.bind(this);
    }

    componentWillMount() {
        this.props.getGame();
    }

    matchId(id) {
        for (let i = 0; i < this.props.participants.length; i++) {
            if (this.props.participants[i].id === id) {
                return this.props.participants[i].login;
            }
        }
    }

    getStatus() {

        if (!this.props.isStarted) {
            return (<p>{"No game started"}</p>);}
        else if (this.props.finished) {
            if (this.props.totalScores[0].score > this.props.totalScores[1].score)
                return (<p>{`The game is finished, ${this.matchId(this.props.totalScores[0].id)} won !`}</p>);
            else if (this.props.totalScores[1].score > this.props.totalScores[0].score) 
                return (<p>{`The game is finished, ${this.matchId(this.props.totalScores[1].id)} won !`}</p>);
            else 
                return (<p>{"The game is finished, that was a draw !"}</p>);
        } else if (this.props.nextRound) {
            return (
                <Fragment><p>{"The next round will start in "}</p>
                    <CountDown countDown={this.props.nextRound}/>
                </Fragment>);
        } else if (this.props.activeRound && this.props.activeRound.finished) {
            if (this.props.activeRound.scores[0].score > this.props.activeRound.scores[1].score)
                return (<p>{`The round is finished, ${this.matchId(this.props.activeRound.scores[0].id)} won !`}</p>);
            else if (this.props.activeRound.scores[0].score < this.props.activeRound.scores[1].score)
                return (<p>{`The round is finished, ${this.matchId(this.props.activeRound.scores[1].id)} won !`}</p>);
            else 
                return (<p>{"The round is finished, that was a draw !"}</p>);
        } else {
            return (<p>{"The game has begun, waiting for a round to start"}</p>);
        }
    }

    getScore(id) {
        if (id && this.props.activeRound) {
            for (let i = 0; i < this.props.activeRound.scores.length; i++) {
                if (this.props.activeRound.scores[i].id === id) {
                    return this.props.activeRound.scores[i].score;
                }
            }
        }
        return -1;
    }

    renderParticipants() {
        return this.props.participants.map(participant => {
            return (
                <div key={`participant${participant.id}`} className={"participant"}>
                    <div className={"participantLogin"}>
                        <p>
                            {participant.login}
                        </p>
                    </div>
                    <img src={placeholder} />
                </div>
            );
        });
    }

    renderGlobalScore(id) {
        return (
            <div className={"globalScore"}>
                <p>{this.props.totalScores[id - 1].score}</p>
            </div>
        );
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
                <div className={"roundScore"}><p>{this.getScore(id)}</p></div>
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
                    {(this.props.isStarted) && <div className={"globalScoresWrapper scoresWrapper"}>
                        {this.renderGlobalScore(1)}
                        <div className={"globalText"}><p>Scores</p></div>
                        {this.renderGlobalScore(2)}
                    </div>}
                    {(this.props.isStarted) && <div className={"participantsWrapper"}>
                        {this.renderParticipants()}
                        <span className={"versus"}><p>Vs</p></span>
                    </div>}
                    
                    {(this.props.isStarted && this.props.activeRound && !this.props.activeRound.finished) && <div className={"roundScoresWrapper scoresWrapper"}>
                        {this.renderRoundScore(1)}
                        <div className={"roundText"}><p>Round {this.props.finishedRounds.length + 1} / {this.props.totalRounds}</p></div>
                        {this.renderRoundScore(2)}
                    </div>}
                    {(this.props.isStarted && this.props.activeRound && !this.props.activeRound.finished) &&
                    <div className={"roundInformationsWrapper"}>
                        <h1 className={"roundTitle"}>
                            {this.props.activeRound.title}
                        </h1>
                        <p className={"roundDescription"}>
                            {this.props.activeRound.description}
                        </p>
                    </div>}
                    {(!this.props.isStarted || !this.props.activeRound || this.props.activeRound.finished || this.props.nextRound) &&
                    <div className={"gameStatus"}>
                        {this.getStatus()}
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