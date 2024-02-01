/*
Structure:
Name
TeamID
Number (in team)
Points
Blocks
*/
const db = require("./../database/postgres.database");

const modelPlayer = async (
  firstName,
  lastName,
  teamID,
  number,
  points,
  blocks,
  tournamentID,
) => {
  const player = await getPlayerInTournament(firstName, lastName, teamID);
  if (player.length > 0) {
    return {
      error: "Player already exists in this team",
      code: 400,
      severity: "ERROR",
      detail:
        "Spēlētājs (" +
        firstName +
        " " +
        lastName +
        ") jau eksistē šajā komandā (" +
        teamID +
        ")",
    };
  }

  const text =
    "INSERT INTO players (firstname, teamID, number, points, blocks, lastname, tournamentid) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id";
  const values = [
    firstName,
    teamID,
    number,
    points,
    blocks,
    lastName,
    tournamentID,
  ];
  return await db.query(text, values);
};

const getPlayer = async (playerID) => {
  const text = "SELECT * FROM players WHERE id = $1";
  const values = [playerID];
  return await db.query(text, values);
};

const getPlayerInTournament = async (firstName, lastName, teamID) => {
  const text =
    "SELECT * FROM players WHERE firstname = $1 AND lastname = $2 AND teamid = $3";
  const values = [firstName, lastName, teamID];
  return await db.query(text, values);
};

const getBestBlockers = async (tournamentID) => {
  const text =
    "SELECT * FROM players WHERE tournamentid = $1 ORDER BY blocks DESC LIMIT 10";
  const values = [tournamentID];
  return await db.query(text, values);
};

const getBestPlayers = async (tournamentID) => {
  const text =
    "SELECT * FROM players WHERE tournamentid = $1 ORDER BY points DESC LIMIT 10";
  const values = [tournamentID];
  return await db.query(text, values);
};

module.exports = { modelPlayer, getPlayer, getBestBlockers, getBestPlayers };
