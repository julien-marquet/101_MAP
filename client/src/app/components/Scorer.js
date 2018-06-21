import React, {Component} from "react";
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

    getWinnerClass(participantId) {
        if (this.props.activeRound && this.props.activeRound.winner === participantId) {
            return "win";
        } else if (this.props.activeRound && this.props.activeRound.winner === null) {
            return "draw";
        } else {
            return "loose";
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

    matchId(id) {
        for (let i = 0; i < this.props.participants.length; i++) {
            if (this.props.participants[i].id === id) {
                return this.props.participants[i].login;
            }
        }
    }

    getRoundStatus() {
        if (this.props.finished) {
            if (this.props.totalScores && this.props.totalScores[0].score > this.props.totalScores[1].score)
                return `The game is finished, ${this.matchId(this.props.totalScores[0].id)} has won !`;
            else if (this.props.totalScores && this.props.totalScores[1].score > this.props.totalScores[0].score) {
                return `The game is finished, ${this.matchId(this.props.totalScores[1].id)} has won !`;
            }
            else 
                return "The game is finished, hat was a draw !";
        }
        else if (this.props.nextRound) {
            return "display nextRound countDown";
        }
        else if (this.props.activeRound) {
            if (this.props.activeRound.finished) {
                if (this.props.activeRound.winner) 
                    return `${this.matchId(this.props.activeRound.winner)} has won the round !`;
                else 
                    return "That was a draw !";
            } else {
                if (this.props.activeRound.winner) 
                    return `${this.matchId(this.props.activeRound.winner)} is winning the round !`;
                else 
                    return "That's a draw !";
            }
        } else if (this.props.isStarted) {
            return "The game is started, waiting for a round to start";
        } else {
            return "No game started";
        }
    }

    renderParticipants() {
        return this.props.participants.map(participant => {
            return (
                <div key={`participantBlock${participant.id}`} className={`participantBlock ${this.getWinnerClass(participant.id)}`}>
                    <img src={placeholder} />
                    <div className={"participantLogin"}>
                        <p>{participant.login}</p>
                    </div>
                    <div className={"bottomWrapper"}>
                        {this.props.isScorer && <div className={"scoreUpdate remove"} onClick={() => {
                            this.props.updateRound({
                                target: participant.id,
                                type: "REMOVE"
                            });
                        }}>
                        -
                        </div>}
                        <div className={"participantScore"}>
                            <p>{this.getScore(participant.id)}</p>
                        </div>
                        {this.props.isScorer && <div className={"scoreUpdate add"}  onClick={() => {
                            this.props.updateRound({
                                target: participant.id,
                                type: "ADD"
                            });
                        }}>
                        +
                        </div>}
                    </div>
                </div>
            );
        });
    }

    render(){ 
        console.log(this.props);
        if (this.state.dismissed || !(this.props.isStarted || this.props.isScorer)) {
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
                    {(this.props.activeRound) && <h2>{this.props.activeRound.title}</h2>}
                    {(this.props.activeRound) && <p>{this.props.activeRound.description}</p>}
                    <div className={"participantWrapper"}>
                        {this.renderParticipants()}
                    </div>
                    <p className={"gameStatus"}>{this.getRoundStatus()}</p>
                    {(this.props.isStarted) && <div className={"totalWrapper"}>
                        <p>Global score</p>
                        <ul>
                            <li>{this.props.participants[0].login} : {this.props.totalScores[0].score}</li>
                            <li>{this.props.participants[1].login} : {this.props.totalScores[1].score}</li>
                        </ul>
                    </div>}
                    {(this.props.isStarted) && <p>{`Finished rounds : ${this.props.finishedRounds.length}`}</p>}
                    {(this.props.isStarted) && <p>{`Total rounds : ${this.props.totalRounds}`}</p>}
                    {(!this.props.isScored) &&
                    <div className={"controll"}>
                        {(!this.props.isStarted) && <button className={"startRound"} onClick={() => {
                            this.props.startGame();
                        }}>
                            Start game
                        </button>}
                        {(this.props.isStarted) && <button className={"startGame"} onClick={() => {
                            this.props.endGame();
                        }}>
                            End game 
                        </button>}
                        {(this.props.isStarted) && <div className={"StartRoundWrapper"}>
                            <button className={"startRound"} onClick={() => {
                                this.props.goNextRound({countDown: this.refs.roundCountDown.value});
                            }}>Start round in</button>
                            <input type={"number"} ref={"roundCountDown"} /> seconds
                        </div>}
                        {(this.props.isStarted) && <button className={"finishRound"} onClick={() => {
                            this.props.finishRound();
                        }}>
                            Finish Round
                        </button>}
                        {(this.props.isStarted) && <button className={"prevRound"} onClick={() => {
                            this.props.prevRound();
                        }}>
                            Previous Round
                        </button>}
                        {(this.props.isStarted) && <button className={"resetRound"} onClick={() => {
                            this.props.resetRound();
                        }}>
                            Reset Round
                        </button>}
                    </div>}
                </div>
            </div>
        );
    }
}

export default Scorer;