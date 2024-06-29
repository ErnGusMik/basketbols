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
  /* POST /api/teams/new/batch
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
    UserID
    */

  // Get user ID from authorization header
  const header = req.headers.authorization.split(" ")[1];
  const token = JSON.parse(
    Buffer.from(header.split(".")[1], "base64").toString(),
  );
  const userID = token.sub;

  // Check if tournament exists && user has access to it
  const tournamentID = await helpers.verifyTournamentOwner(
    req.body.tournamentID,
    userID,
  );

  // If false, return error
  if (!tournamentID) {
    res.status(400).send({
      error: "Tournament not found or user does not have access to it",
      code: 400,
      severity: "ERROR",
      detail: "Turnīrs nav atrasts vai arī jums nav pieejas šim turnīram!",
    });
    return;
  }

  const teamIDs = [];
  let errorInTeam = false;

  for (let i = 0; i < req.body.teams.length; i++) {
    try {
      req.body.teams[i].group = parseInt(req.body.teams[i].group);
    } catch (err) {
      res.status(400).send({
        error: "Group must be an integer",
        code: 400,
        severity: "ERROR",
        detail: "Grupai jābūt naturālam skaitlim!",
      });
      return;
    }

    // Check if team name matches another team name in the body.teams array
    for (let j = 0; j < req.body.teams.length; j++) {
      if (req.body.teams[i].name === req.body.teams[j].name && i !== j) {
        res.status(400).send({
          error: "Team names must be unique",
          code: 400,
          severity: "ERROR",
          detail: "Komandu vārdiem jābūt unikāliem!",
        });
        return;
      }
    }
    const result = await teams.modelTeam(
      req.body.teams[i].name,
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
      req.body.teams[i].group,
      req.body.teams[i].headCoach,
    );
    if (result.error) {
      res.status(400).send(result);
      errorInTeam = true;
      return;
    }
    teamIDs.push(result[0].id.toString());
  }

  if (errorInTeam) return;
  res.status(201).send(teamIDs);
  return;
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
    res.status(400).send({
      error: "Tournament not found",
      code: 400,
      severity: "ERROR",
      detail: "Turnīrs nav atrasts!",
    });
    return;
  }
  const refereeIDs = [];
  for (let i = 0; i < req.body.referees.length; i++) {
    const result = await referees.modelReferee(
      req.body.tournamentID,
      req.body.referees[i].name,
      req.body.referees[i].finals,
    );
    refereeIDs.push(result[0].id.toString());
  }
  res.status(201).send(refereeIDs);
};

const newPlayer = async (req, res, next) => {
  /* POST /api/players/new/batch
    Structure:
    firstName
    lastName
    TeamID
    Number (in team)
    Points
    Blocks
    */

  // Get user ID from authorization header
  const header = req.headers.authorization.split(" ")[1];
  const token = JSON.parse(
    Buffer.from(header.split(".")[1], "base64").toString(),
  );
  const userID = token.sub;

  // Check if tournament exists && user has access to it
  const tournamentVerified = await helpers.verifyTournamentOwner(
    req.body.tournamentID,
    userID,
  );

  if (!tournamentVerified) {
    Response.send({
      error: "Tournament not found or user does not have access to it",
      code: 400,
      severity: "ERROR",
      detail: "Turnīrs nav atrasts vai arī jums nav pieejas šim turnīram!",
    });
    return;
  }

  const teamID = helpers.verifyTeamID(req.body.teamID);
  if (!teamID) {
    res.status(400).send({
      error: "Team not found",
      code: 400,
      severity: "ERROR",
      detail: "Komanda nav atrasta!",
    });
    return;
  }
  const playerIDs = [];

  for (let i = 0; i < req.body.players.length; i++) {
    const result = await players.modelPlayer(
      req.body.players[i].firstName,
      req.body.players[i].lastName,
      req.body.players[i].teamID,
      req.body.players[i].number,
      0,
      0,
      req.body.tournamentID,
    );
    playerIDs.push(result[0].id.toString());
  }
  res.status(201).send(playerIDs);
  return;
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
  const header = req.headers.authorization.split(" ")[1];
  const token = JSON.parse(
    Buffer.from(header.split(".")[1], "base64").toString(),
  );
  const userID = token.sub;

  const tournamentID = await helpers.verifyTournamentOwner(
    req.body.tournamentID,
    userID,
  );
  if (!tournamentID) {
    res.status(400).send({
      error: "Tournament not found",
      code: 400,
      severity: "ERROR",
      detail: "Turnīrs neeksistē!",
    });
    return;
  }

  const gameIDs = [];

  for (let i = 0; i < req.body.games.length; i++) {
    const team1ID = await helpers.verifyTeamByName(
      req.body.games[i].team1Name,
      req.body.tournamentID,
    );
    if (!team1ID) {
      res.status(400).send({
        error: `Team1 (${req.body.games[i].team1Name}) not found`,
        code: 400,
        severity: "ERROR",
        detail: "1. komanda nav atrasta!",
      });
      return;
    }

    const team2ID = await helpers.verifyTeamByName(
      req.body.games[i].team2Name,
      req.body.tournamentID,
    );
    if (!team2ID) {
      res.status(400).send({
        error: "Team2 not found",
        code: 400,
        severity: "ERROR",
        detail: "2. komanda nav atrasta!",
      });
      return;
    }

    const refereeIDs = [];
    let refereeError = false;
    for (let j = 0; j < req.body.games[i].referees.length; j++) {
      const refereeID = await helpers.verifyRefereeByName(
        req.body.games[i].referees[j],
        req.body.tournamentID,
      );
      if (!refereeID) {
        res.status(400).send({
          error: "Referee not found",
          code: 400,
          severity: "ERROR",
          detail: "Tiesnesis nav atrasts!",
        });
        refereeError = true;
        return;
      }
      refereeIDs.push(refereeID[0].id);
    }

    if (refereeError) return;

    if (
      req.body.games[i].finals !== 4 ||
      req.body.games[i].finals !== 2 ||
      req.body.games[i].finals !== 1 ||
      req.body.games[i].finals !== 3
    )
      req.body.games[i].finals = 0;

    try {
      parseInt(req.body.games[i].group);
    } catch (err) {
      res.status(400).send({
        error: "Group must be an integer",
        code: 400,
        severity: "ERROR",
        detail: "Grupai jābūt naturālam skaitlim!",
      });
      return;
    }

    try {
      new Date(req.body.games[i].date);
      new Date(req.body.games[i].time);
    } catch {
      res.status(400).send({
        error: "Date and time must be in correct format",
        code: 400,
        severity: "ERROR",
        detail: "Datums un laiks jābūt pareizā formātā!",
      });
      return;
    }

    const result = await games.modelGame(
      team1ID[0].id,
      team2ID[0].id,
      0,
      0,
      JSON.stringify(refereeIDs),
      req.body.games[i].date,
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
      JSON.stringify({
        points1: "",
        points2: "",
        points3: "",
      }),
      JSON.stringify({
        points1: "",
        points2: "",
        points3: "",
      }),
      req.body.games[i].finals,
      req.body.games[i].group,
      req.body.games[i].venue,
      req.body.games[i].time,
    );
    gameIDs.push(result[0].id.toString());
  }
  res.status(201).send(gameIDs);
};

const updateGame = async (req, res, next) => {
  /* PUT /api/games/update/:id */
  // const header = req.headers.authorization.split(" ")[1];
  // const token = JSON.parse(
  //     Buffer.from(header.split(".")[1], "base64").toString()
  // );
  // const userID = token.sub;

  const values = [
    req.params.id,
    req.body.team1points,
    req.body.team2points,
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
  res.status(204).send("Game updated");
};

// Create new public game (for security reasons?). Uses a seperate table in db with fewer columns.
const newPublicGame = async (req, res, next) => {
  /* POST /api/games/new/public
    Structure:
    Team1Name
    Team2Name
    Team1Points
    Team2Points
    Group
    Time remaining
    Venue
    Quarter
    Team1Fouls
    Team2Fouls
    Timestamp (when request is sent, to sync client with admin)

    UserID (from token, for verification)
    */
  const header = req.headers.authorization.split(" ")[1];
  const token = JSON.parse(
    Buffer.from(header.split(".")[1], "base64").toString(),
  );
  const userID = token.sub;

  const game = await games.getGame(req.body.gameid);

  if (!game || game.length === 0) {
    res.status(400).send({
      error: "Game not found",
      code: 400,
      severity: "ERROR",
      detail: "Spēle nav atrasta!",
    });
    return;
  }

  const tournamentID = await helpers.verifyTournamentOwner(
    game[0].tournamentid,
    userID,
  );

  if (!tournamentID) {
    res.status(401).send({
      error: "Tournament not found or unauthorized",
      code: 400,
      severity: "ERROR",
      detail: "Turnīrs nav atrasts vai arī jums nav pieejas šim turnīram!",
    });
    return;
  }

  if (game[0].public_id !== null) {
    res.status(400).send({
      error: "Game already has a public ID",
      code: 400,
      severity: "ERROR",
      detail: "Spēlei jau ir publiskais ID!",
    });
    return;
  }

  const gameID = await games.modelPublicGame(
    userID,
    req.body.team1name,
    req.body.team2name,
    0,
    0,
    game[0].gamegroup,
    6000,
    game[0].venue,
    1,
    0,
    0,
    req.body.timestamp,
  );

  games.addPublicID(game[0].id, gameID[0].id);

  res.status(201).send(gameID[0]);
};

const getLiveGames = async (req, res, next) => {
  /* GET /api/games/live */
  const result = await games.getLiveGames();
  res.status(200).send(result);
};

// const updatePublicGame = async (req, res, next) => {
//     /* PUT /api/games/update/public/:id */
//     const values = [
//         req.params.id,
//         req.body.team1Points,
//         req.body.team2Points,
//         req.body.group,
//         req.body.timeRemaining,
//         req.body.venue,
//         req.body.quarter,
//         req.body.team1Fouls,
//         req.body.team2Fouls,
//         req.body.timestamp,
//     ];
//     await games.updatePublicGame(...values);
//     res.status(204).send("Game updated");
// };

// GET requests

const getGame = async (req, res, next) => {
  /* GET /api/games/:id */
  const result = await games.getGame(req.params.id);
  res.status(200).send([result[0]]);
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

const getTeams = async (req, res, next) => {
  /* GET /api/teams/batch/:id */
  const idArray = req.params.id.split("+");
  const result = [];
  for (let i = 0; i < idArray.length; i++) {
    const team = await teams.getTeam(parseInt(idArray[i]));
    result.push(team[0]);
  }
  res.status(200).send(result);
};

const getTeamsInTournament = async (req, res, next) => {
  /* GET /api/tournaments/:id/teams */
  const tournamentID = await helpers.verifyTournamentID(req.params.id);
  if (!tournamentID) {
    res.status(400).send({
      error: "Tournament not found",
      code: 400,
      severity: "ERROR",
      detail: "Turnīrs nav atrasts!",
    });
    return;
  }
  const result = await teams.getTeamsInTournament(req.params.id);
  res.status(200).send(result);
};

const getPlayer = async (req, res, next) => {
  /* GET /api/players/:id */
  const result = await players.getPlayer(req.params.id);
  res.status(200).send(result[0]);
};

const getPlayerByNumber = async (req, res, next) => {
  /* GET /api/players/batch/:nums */
  const teamID = await helpers.verifyTeamID(req.params.team);
  if (!teamID) {
    res.status(400).send({
      error: "Team not found",
      code: 400,
      severity: "ERROR",
      detail: "Komanda nav atrasta!",
    });
    return;
  }
  const playerList = req.params.nums.split("+");
  const result = [];

  if (playerList.length > 5) {
    res.status(400).send({
      error: "Too many players requested",
      code: 400,
      severity: "ERROR",
      detail: "Pārāk daudz spēlētāji pieprasīti!",
    });
    return;
  }

  for (let i = 0; i < playerList.length; i++) {
    const player = await players.getPlayerByNumber(
      req.params.team,
      playerList[i],
    );
    if (!player[0]) {
      player[0] = {
        firstname: "Bez vārda",
        lastname: "",
      };
    }
    result.push(player[0]);
  }

  res.status(200).send(result);
};

const getTournamentIDfromPage = async (req, res, next) => {
  /* GET /tournaments/getIDfromName?name=xxxxx */
  const pageName = req.query.name;
  const lowercase = pageName.toLowerCase();
  const result = await tournaments.getTournamentPage(lowercase);
  res.send(
    result[0]
      ? {
          id: result[0].id,
          name: result[0].name,
          description: result[0].description,
          organizer: result[0].organizer,
          location: result[0].location,
          logo: result[0].logo,
        }
      : {
          id: null,
          errror: "Tournament not found",
          code: 404,
          severity: "ERROR",
          detail: "Turnīrs nav atrasts!",
        },
  );
  return;
};

const getUserTournaments = async (req, res, next) => {
  // GET /api/:userID/tournaments
  const userID = await helpers.verifyUserID(req.params.userID);
  if (!userID) {
    res.status(400).send({
      error: "User not found",
      code: 400,
      severity: "ERROR",
      detail: "Lietotājs nav atrasts!",
    });
    return;
  }
  const result = await tournaments.getUserTournaments(req.params.userID);
  res.status(200).send(result);
};

const getRefereesInTournament = async (req, res, next) => {
  // GET /api/tournaments/:id/referees
  const tournamentID = await helpers.verifyTournamentID(req.params.id);

  if (!tournamentID) {
    res.status(400).send({
      error: "Tournament not found",
      code: 400,
      severity: "ERROR",
      detail: "Turnīrs nav atrasts!",
    });
    return;
  }

  const result = await referees.getRefereesInTournament(req.params.id);
  res.status(200).send(result);
};

const getGamesInTournament = async (req, res, next) => {
  // GET /api/tournaments/:id/games
  const tournamentID = await helpers.verifyTournamentID(req.params.id);

  if (!tournamentID) {
    res.status(400).send({
      error: "Tournament not found",
      code: 400,
      severity: "ERROR",
      detail: "Turnīrs nav atrasts!",
    });
    return;
  }

  const result = await games.getGamesInTournament(req.params.id);
  res.status(200).send(result);
};

const getBestBlockers = async (req, res, next) => {
  /* GET /api/tournaments/:id/stats/best-blockers */
  const tournamentID = await helpers.verifyTournamentID(req.params.id);

  if (!tournamentID) {
    res.status(400).send({
      error: "Tournament not found",
      code: 400,
      severity: "ERROR",
      detail: "Turnīrs nav atrasts!",
    });
    return;
  }

  const result = await players.getBestBlockers(req.params.id);
  res.status(200).send(result);
};

const getBestPlayers = async (req, res, next) => {
  /* GET /api/tournaments/:id/stats/best-players */
  const tournamentID = await helpers.verifyTournamentID(req.params.id);

  if (!tournamentID) {
    res.status(400).send({
      error: "Tournament not found",
      code: 400,
      severity: "ERROR",
      detail: "Turnīrs nav atrasts!",
    });
    return;
  }

  const result = await players.getBestPlayers(req.params.id);
  res.status(200).send(result);
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
  getPlayerByNumber,
  getTournamentIDfromPage,
  getUserTournaments,
  getRefereesInTournament,
  getGamesInTournament,
  getTeams,
  getTeamsInTournament,
  getBestBlockers,
  getBestPlayers,
  newPublicGame,
  // updatePublicGame,
  // getPublicGame,
  getLiveGames,
};
