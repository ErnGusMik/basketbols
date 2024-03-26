const { Subject } = require("rxjs");
const games = require("../models/games.models");

const gamesSubject = new Subject();

const getLiveGame = (req, res, next) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    res.write("retry: 10000\n\n");

    const subscription = gamesSubject.subscribe((game) => {
        if (game.gameId === req.params.gameId) {
            res.write(`data: ${JSON.stringify(game.game)}\n\n`);
        }
    });

    req.on("close", () => {
        subscription.unsubscribe();
    });
};

const getLiveGameOnce = async (req, res, next) => {
    res.send(await games.getPublicGame(req.params.id));
};

const updateLiveGame = async (req, res, next) => {
    const header = req.headers.authorization.split(" ")[1];
    const token = JSON.parse(
        Buffer.from(header.split(".")[1], "base64").toString()
    );
    const userID = token.sub;
    const values = [
        req.params.id,
        req.body.team1Points,
        req.body.team2Points,
        req.body.timeRemaining,
        req.body.quarter,
        req.body.team1Fouls,
        req.body.team2Fouls,
        req.body.timestamp,
        req.body.paused,
        req.body.team1_timeouts,
        req.body.team2_timeouts,
        req.body.team1FoulDetails,
        req.body.team2FoulDetails,
        req.body.time_24s,
        userID,
    ];
    await games.updatePublicGame(...values);

    const gameId = req.params.gameId;
    const game = req.body;
    gamesSubject.next({ gameId, game });
    res.status(204).send("Game updated");
};

module.exports = { getLiveGame, updateLiveGame, getLiveGameOnce };
