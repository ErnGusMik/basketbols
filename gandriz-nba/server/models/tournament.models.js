/* 
Structure:
ID
Name
Description
Location
Organizer
Logo
Dates
Groups
FinalsNum
RefereeNum
*/

const modelTournament = (id, name, description, location, organizer, logo, dates, groups, finalsNum, refereeNum) => {
    const text = 'INSERT INTO tournaments (id, name, description, location, organizer, logo, dates, groups, finalsNum, refereeNum) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    const values = [id, name, description, location, organizer, logo, dates, groups, finalsNum, refereeNum];
    return {
        text,
        values
    };
}

module.exports = modelTournament;