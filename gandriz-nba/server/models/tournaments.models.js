/* 
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
const db = require("../database/postgres.database");


const modelTournament = async (
  userID,
  name,
  description,
  location,
  organizer,
  logo,
  dates,
  groups,
  finalsNum,
  refereeNum
) => {
  const text =
    "INSERT INTO tournaments (userid, name, description, location, organizer, logo, dates, groups, finalsNum, refereeNum) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id";
  const values = [
    userID,
    name,
    description,
    location,
    organizer,
    logo,
    dates,
    groups,
    finalsNum,
    refereeNum,
  ];
  return await db.query(text, values);
};

const getTournament = async tournamentID => {
  const text = "SELECT * FROM tournaments WHERE id = $1";
  const values = [tournamentID];
  return await db.query(text, values);
}

const getTournamentPage = (pageName) => {
  const text = "SELECT * FROM tournaments WHERE pagename = $1";
  const values = [pageName];
  return db.query(text, values);
}


module.exports = {modelTournament, getTournament, getTournamentPage};
