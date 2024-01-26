const routes = require("./../routes/app.routes");

const express = require("express");
const router = express.Router();

router.post("/tournaments/new", routes.newTournament);
router.post("/teams/new/batch", routes.newTeam);
router.post("/referees/new/batch", routes.newReferee);
router.post("/players/new/batch", routes.newPlayer);
router.post("/games/new/batch", routes.newGame);

router.put("/games/update/:id", routes.updateGame);

router.get("/games/:id", routes.getGame);
router.get("/tournaments/:id", routes.getTournament);
router.get("/tournaments/:id/referees", routes.getRefereesInTournament);
router.get("/tournaments/:id/games", routes.getGamesInTournament);
router.get("/referees/:id", routes.getReferee);
router.get("/teams/:id", routes.getTeam);
router.get("/players/:id", routes.getPlayer);

router.get("/:userID/tournaments", routes.getUserTournaments);

module.exports = router;
