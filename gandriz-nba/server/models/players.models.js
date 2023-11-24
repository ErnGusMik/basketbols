/*
Structure:
Name
TeamID
Number (in team)
Points
Blocks
*/
const db = require("./../database/postgres.database");

const modelPlayer = async (name, teamID, number, points, blocks) => {
  const text =
    "INSERT INTO players (name, teamID, number, points, blocks) VALUES ($1, $2, $3, $4, $5) RETURNING id";
  const values = [name, teamID, number, points, blocks];
  return await db.query(text, values);
};

const getPlayer = async (playerID) => {
  const text = "SELECT * FROM players WHERE id = $1";
  const values = [playerID];
  return await db.query(text, values);
};

module.exports = { modelPlayer, getPlayer };
