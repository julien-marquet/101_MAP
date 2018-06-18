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
        this.props.getScores();
    }

    getWinnerClass(participantId) {
        if (this.props.winner === participantId) {
            return "win";
        } else if (this.props.winner === null) {
            return "draw";
        } else {
            return "loose";
        }
    }

    matchId(id) {
        for (let i = 0; i < this.props.participants.length; i++) {
            if (this.props.participants[i].id === id) {
                return this.props.participants[i].login;
            }
        }
    }

    getWinnerAnnouncement() {
        if (this.props.winner) {
            return `${this.matchId(this.props.winner)} is winning !`;
        } else {
            return "That's a draw !";
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
                            this.props.updateScores({
                                target: participant.id,
                                type: "REMOVE"
                            });
                        }}>
                        -
                        </div>}
                        <div className={"participantScore"}>
                            <p>{participant.score}</p>
                        </div>
                        {this.props.isScorer && <div className={"scoreUpdate add"}  onClick={() => {
                            this.props.updateScores({
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
                        {this.renderParticipants()}
                    </div>
                    <p className={"participantsStatus"}>{this.getWinnerAnnouncement()}</p>
                </div>
            </div>
        );
    }
}

export default Scorer;