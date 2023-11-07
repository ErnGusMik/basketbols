/*
Structure:
TournamentID
Name
Finals
*/
const db = require("./../database/postgres.database");

const modelReferee = async (tournamentID, name, finals) => {
  const text =
    "INSERT INTO referees (tournamentID, name, finals) VALUES ($1, $2, $3) RETURNING id";
  const values = [tournamentID, name, finals];
  return await db.query(text, values);
};

module.exports = modelReferee;
