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
    "INSERT INTO tournaments (userID, name, description, location, organizer, logo, dates, groups, finalsNum, refereeNum) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id";
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
  return await db(text, values);
};

module.exports = modelTournament;
