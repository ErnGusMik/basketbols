/*
Structure:
Name
TeamID
Number (in team)
Points
Blocks
*/
const db = require("./../database/postgres.database");

const modelPlayer = async (firstName, lastName, teamID, number, points, blocks,) => {
  const text =
    "INSERT INTO players (firstname, teamID, number, points, blocks, lastname) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
  const values = [firstName, teamID, number, points, blocks, lastName];
  return await db.query(text, values);
};

const getPlayer =  async playerID => {
  const text = "SELECT * FROM players WHERE id = $1";
  const values = [playerID];
  return await db.query(text, values);
}

module.exports = {modelPlayer, getPlayer};
