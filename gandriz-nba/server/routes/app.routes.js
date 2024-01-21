const helpers = require("./../helpers/app.helpers");
const tournaments = require("./../models/tournaments.models");
const teams = require("./../models/teams.models");
const referees = require("./../models/referees.models");
const players = require("./../models/players.models");
const games = require("./../models/games.models");

// POST & PUT requests

const newTournament = async (req, res, next) => {
  /* POST /api/tournaments/new
    Structure:
    ID
    UserID
    Name
    Description
    Location
    Organizer
    Logo
    Dates (tournament start and end dates)
    Groups (number of groups)
    FinalsNum
    RefereeNum
    */
  const userID = await helpers.verifyUserID(req.body.userID);
  if (!userID) {
    res.status(400).send("User not found");
    return;
  }
  try {
    req.body.groups = parseInt(req.body.groups);
    req.body.finalsNum = parseInt(req.body.finalsNum);
    req.body.refereeNum = parseInt(req.body.refereeNum);
  } catch (err) {
    res.status(400).send("Groups, finalsNum and refereeNum must be integers");
    return;
  }

  const result = await tournaments.modelTournament(
    req.body.userID,
    req.body.name,
    req.body.description,
    req.body.location,
    req.body.organizer,
    req.body.logo,
    req.body.dates,
    req.body.groups,
    req.body.finalsNum,
    req.body.refereeNum,
    req.body.pageName,
  );

  if (result.error) {
    res.status(400).send(result);
    return;
  }

  res.status(201).send(result[0].id.toString());
};

const newTeam = async (req, res, next) => {
  /* POST /api/teams/new
    Structure:
    Name
    TournamentPoints
    Wins
    Losses
    Ties
    AvgPoints
    AvgBlocks
    Avg3points
    AvgLostPoints
    TournamentID
    */
  const tournamentID = await helpers.verifyTournamentID(req.body.tournamentID);
  if (!tournamentID) {
    res.status(400).send("Tournament not found");
    return;
  }
  const result = await teams.modelTeam(
    req.body.name,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    req.body.tournamentID,
  );
  res.status(201).send(result[0].id.toString());
};

const newReferee = async (req, res, next) => {
  /* POST /api/referees/new
    Structure:
    TournamentID
    Name
    Finals
    */
  const tournamentID = helpers.verifyTournamentID(req.body.tournamentID);
  if (!tournamentID) {
    res.status(400).send("Tournament not found");
    return;
  }
  const result = await referees.modelReferee(
    req.body.tournamentID,
    req.body.name,
    req.body.finals,
  );
  res.status(201).send(result[0].id.toString());
};

const newPlayer = async (req, res, next) => {
  /* POST /api/players/new
    Structure:
    Name
    TeamID
    Number (in team)
    Points
    Blocks
    */
  const teamID = helpers.verifyTeamID(req.body.teamID);
  if (!teamID) {
    res.status(400).send("Team not found");
    return;
  }
  const result = await players.modelPlayer(
    req.body.name,
    req.body.teamID,
    req.body.number,
    0,
    0,
  );
  res.status(201).send(result[0].id.toString());
};

const newGame = async (req, res, next) => {
  /* POST /api/games/new
    Structure:
    Team1ID
    Team2ID
    Team1Points
    Team2Points
    RefereeIDs (seperated with ',')
    Date  (varchar 'hh:mm dd/mm/yyyy')
    TournamentID

    team1Blocks
    team13points
    team1LostPoints
    team12points

    team2Blocks
    team23points
    team2LostPoints
    team22points

    TimesTied
    TimesLeadChanged

    team2BiggestLead
    team1BiggestLead
    team1MostPointsInRow
    team2MostPointsInRow
    team1BestPlayers (playerIDs seperated with ',')
    team2BestPlayers (playerIDs seperated with ',')
    Finals (0 if not, 4 for quarterfinals, 2 for semifinals, 1 for finals, 3 for 3rd place game)
    */
  const team1ID = await helpers.verifyTeamID(req.body.team1ID);
  if (!team1ID) {
    res.status(400).send("Team1 not found");
    return;
  }
  const team2ID = await helpers.verifyTeamID(req.body.team2ID);
  if (!team2ID) {
    res.status(400).send("Team2 not found");
    return;
  }
  const refereeIDs = req.body.refereeIDs.split(",");
  for (let i = 0; i < refereeIDs.length; i++) {
    const refereeID = await helpers.verifyRefereeID(refereeIDs[i]);
    if (!refereeID) {
      res.status(400).send("Referee not found");
      return;
    }
  }
  const tournamentID = await helpers.verifyTournamentID(req.body.tournamentID);
  if (!tournamentID) {
    res.status(400).send("Tournament not found");
    return;
  }
  const result = await games.modelGame(
    req.body.team1ID,
    req.body.team2ID,
    0,
    0,
    req.body.refereeIDs,
    req.body.date,
    req.body.tournamentID,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    req.body.finals,
  );
  res.status(201).send(result[0].id.toString());
};

const updateGame = async (req, res, next) => {
  /* PUT /api/games/update/:id */
  const values = [
    req.params.id,
    req.body.team1Points,
    req.body.team2Points,
    req.body.team1Blocks,
    req.body.team13points,
    req.body.team1LostPoints,
    req.body.team12points,
    req.body.team2Blocks,
    req.body.team23points,
    req.body.team2LostPoints,
    req.body.team22points,
    req.body.timesTied,
    req.body.timesLeadChanged,
    req.body.team2BiggestLead,
    req.body.team1BiggestLead,
    req.body.team1MostPointsInRow,
    req.body.team2MostPointsInRow,
    req.body.team1BestPlayers,
    req.body.team2BestPlayers,
  ];
  await games.updateGame(...values);
  res.status(200).send("Game updated");
};

// GET requests

const getGame = async (req, res, next) => {
  /* GET /api/games/:id */
  const result = await games.getGame(req.params.id);
  res.status(200).send(result[0]);
};

const getTournament = async (req, res, next) => {
  /* GET /api/tournaments/:id */
  const result = await tournaments.getTournament(req.params.id);
  res.status(200).send(result[0]);
};

const getReferee = async (req, res, next) => {
  /* GET /api/referees/:id */
  const result = await referees.getReferee(req.params.id);
  res.status(200).send(result[0]);
};

const getTeam = async (req, res, next) => {
  /* GET /api/teams/:id */
  const result = await teams.getTeam(req.params.id);
  res.status(200).send(result[0]);
};

const getPlayer = async (req, res, next) => {
  /* GET /api/players/:id */
  const result = await players.getPlayer(req.params.id);
  res.status(200).send(result[0]);
};

const getTournamentPage = async (req, res, next) => {
  /* GET /:pageName */
  const pageID = req.params.pageName.toString();
  const lowercase = pageID.toLowerCase();
  const result = await tournaments.getTournamentPage(lowercase);
  res.send({ result: result[0] ? result[0] : 0 });
  return;
};

module.exports = {
  newTournament,
  newTeam,
  newReferee,
  newPlayer,
  newGame,
  updateGame,
  getGame,
  getTournament,
  getReferee,
  getTeam,
  getPlayer,
  getTournamentPage,
};
