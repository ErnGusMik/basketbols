const helpers = require("./../helpers/app.helpers");
const tournamentModel = require("./../models/tournaments.models");
const teamModel = require("./../models/teams.models");
const refereeModel = require("./../models/referees.models");
const playerModel = require("./../models/players.models");
const game = require("./../models/games.models");

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
  // if (!req.body.logo.is("img") || !req.body.logo) {
  //   res.status(400).send("Logo must be an image");
  //   return;
  // }
  const result = await tournamentModel(
    req.body.userID,
    req.body.name,
    req.body.description,
    req.body.location,
    req.body.organizer,
    req.body.logo,
    req.body.dates,
    req.body.groups,
    req.body.finalsNum,
    req.body.refereeNum
  );
  res.status(201).send(result[0].id.toString()); // !! result.rows[0].id.toString() or result[0].id.toString() ??
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
  const result = await teamModel(
    req.body.name,
    req.body.points,
    req.body.tournamentPoints,
    req.body.wins,
    req.body.losses,
    req.body.ties,
    req.body.avgPoints,
    req.body.avgBlocks,
    req.body.avg3points,
    req.body.AvgLostPoints,
    req.body.tournamentID
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
  const result = await refereeModel(
    req.body.tournamentID,
    req.body.name,
    req.body.finals
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
  const result = await playerModel(
    req.body.name,
    req.body.teamID,
    req.body.number,
    0,
    0
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
  const result = await game.modelGame(
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
    req.body.finals
  );
  res.status(201).send(result[0].id.toString());
};

const updateGame = async (req, res, next) => {
  /* put /api/games/update/:id */
  const values = [
    req.params.gameID,
    req.body.team1Points,
    req.body.team2Points,
    req.body.refereeIDs,
    req.body.date,
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

  const refereeIDs = req.body.refereeIDs.split(",");
  for (let i = 0; i < refereeIDs.length; i++) {
    const refereeID = await helpers.verifyRefereeID(refereeIDs[i]);
    if (!refereeID) {
      res.status(400).send("Referee not found");
      return;
    }
  }
  await game.updateGame(...values);
  res.status(200).send("Game updated");
};

const getGame = async (req, res, next) => {
  /* GET /api/games/:id */
  const gameID = await helpers.verifyGameID(req.params.id);
  if (!gameID) {
    res.status(400).send("Game not found");
    return;
  }
  const result = await game.getGame(gameID);
  res.status(200).send(result[0]);
};

const getTournament = async (req, res, next) => {
  /* GET /api/tournaments/:id */
  const tournamentID = await helpers.verifyTournamentID(req.params.id);
  if (!tournamentID) {
    res.status(400).send("Tournament not found");
    return;
  }
  const result = await tournamentModel.getTournament(tournamentID);
  res.status(200).send(result[0]);
};

const getReferee = async (req, res, next) => {
  /* GET /api/referees/:id */
  const refereeID = await helpers.verifyRefereeID(req.params.id);
  if (!refereeID) {
    res.status(400).send("Referee not found");
    return;
  }
  const result = await refereeModel.getReferee(refereeID);
  res.status(200).send(result[0]);
};
const getTeam = async (req, res, next) => {
  /* GET /api/teams/:id */
  const teamID = await helpers.verifyTeamID(req.params.id);
  if (!teamID) {
    res.status(400).send("Team not found");
    return;
  }
  const result = await teamModel.getTeam(teamID);
  res.status(200).send(result[0]);
};

const getPlayer = async (req, res, next) => {
  /* GET /api/players/:id */
  const playerID = await helpers.verifyPlayerID(req.params.id);
  if (!playerID) {
    res.status(400).send("Player not found");
    return;
  }
  const result = await playerModel.getPlayer(playerID);
  res.status(200).send(result[0]);
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
  getPlayer
};
