module.exports = {
    rounds: [{
        id: 1,
        finished: false,
        title: "RoundTitle",
        description: "Alors voila c'est comme ca qu'on fait et ca commence maintenant !",
        scores: [{
            id: 1,
            score: 0
        }, {
            id: 2,
            score: 0
        }]
    }, {
        id : 2,
        finished: false,
        title: "RoundTitle2",
        description: "Alors voila c'est comme ca qu'on fait et ca commence maintenant !",
        scores: [{
            id: 1,
            score: 0
        }, {
            id: 2,
            score: 0
        }]
    }],
    participants: [
        {
            id: 1,
            login: "BODO",
        },
        {
            id: 2,
            login: "MAX",
        }
    ],
    allowedScorer: [
        31049
    ],
    finished: false,
    activeRound: null,
    nextRound: null,
    isStarted: false,
    totalScores: [
        {
            id: 1,
            score: 0
        },
        {
            id: 2,
            score: 0
        }
    ]
};
