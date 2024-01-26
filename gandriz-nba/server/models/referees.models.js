/*
Structure:
TournamentID
Name
Finals
*/
const db = require("./../database/postgres.database");

const modelReferee = async (tournamentID, name, finals) => {
  const checkReferee = await getRefereeInTournament(tournamentID, name);
  if (checkReferee.length > 0) {
    return {
      error: "Referee already exists in this tournament!",
      code: 400,
      severity: "ERROR",
      detail: `Tiesnesis (${name}) jau eksistē šajā turnīrā (${tournamentID})`,
    };
  }

  const text =
    "INSERT INTO referees (tournamentID, name, finals) VALUES ($1, $2, $3) RETURNING id";
  const values = [tournamentID, name, finals];
  return await db.query(text, values);
};

const getReferee = async (refereeID) => {
  const text = "SELECT * FROM referees WHERE id = $1";
  const values = [refereeID];
  return await db.query(text, values);
};

const getRefereeInTournament = async (tournamentID, name) => {
  const text = "SELECT * FROM referees WHERE tournamentID = $1 AND name = $2";
  const values = [tournamentID, name];
  return await db.query(text, values);
};

const getRefereesInTournament = async (tournamentID) => {
  const text = "SELECT * FROM referees WHERE tournamentID = $1";
  const values = [tournamentID];
  return await db.query(text, values);
};

module.exports = { modelReferee, getReferee, getRefereesInTournament };
