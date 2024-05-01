const routes = require("./../routes/app.routes");
const liveRoutes = require("./../routes/live.routes");

const express = require("express");
const router = express.Router();

router.post("/tournaments/new", routes.newTournament);
router.post("/teams/new/batch", routes.newTeam);
router.post("/referees/new/batch", routes.newReferee);
router.post("/players/new/batch", routes.newPlayer);
router.post("/games/new/batch", routes.newGame);

router.put("/games/update/:id", routes.updateGame);

router.get("/games/:id", routes.getGame);
router.get("/tournaments/getIDfromName", routes.getTournamentIDfromPage);
router.get("/tournaments/:id", routes.getTournament);
router.get("/tournaments/:id/referees", routes.getRefereesInTournament);
router.get("/tournaments/:id/games", routes.getGamesInTournament);
router.get("/tournaments/:id/teams", routes.getTeamsInTournament);
router.get("/referees/:id", routes.getReferee);
router.get("/teams/:id", routes.getTeam);
router.get("/teams/batch/:id", routes.getTeams);
router.get("/players/:id", routes.getPlayer);
router.get("/players/batch/:team/:nums", routes.getPlayerByNumber);

router.get("/:userID/tournaments", routes.getUserTournaments);

router.get("/tournaments/:id/stats/best-blockers", routes.getBestBlockers);
router.get("/tournaments/:id/stats/best-players", routes.getBestPlayers);

router.post("/games/new/public", routes.newPublicGame);

router.get("/live/games/:id", liveRoutes.getLiveGame);
router.get("/live/games/once/:id", liveRoutes.getLiveGameOnce);
router.put("/live/games/update/:id", liveRoutes.updateLiveGame);

module.exports = router;
