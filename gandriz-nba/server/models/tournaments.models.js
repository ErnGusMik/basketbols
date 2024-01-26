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
    refereeNum,
    pageName
) => {
    const result = await getTournamentPage(pageName).then((result) => {
        if (result.length > 0) {
            return { error: "Tournament with this page name already exists", code: 400, severity: "ERROR", detail: "Turnīrs ar šādu lapas nosaukumu ("+pageName+") jau eksistē!" };
        } else return null;
    });
    if (result) return result;

    const text =
        "INSERT INTO tournaments (userid, name, description, location, organizer, logo, dates, groups, finalsnum, refereeNum, pagename) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id";
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
        pageName,
    ];

    const response = await db.query(text, values);
    if (response.code && response.severity) return { error: 'Tournament with this page name already exists', code: 400, severity: 'ERROR', detail: 'Turnīrs ar šādu lapas nosaukumu ('+pageName+') jau eksistē!' };
    return response;
};

const getTournament = async (tournamentID) => {
    const text = "SELECT * FROM tournaments WHERE id = $1";
    const values = [tournamentID];
    return await db.query(text, values);
};

const getTournamentPage = async (pageName) => {
    const text = "SELECT * FROM tournaments WHERE pagename = $1";
    const values = [pageName];
    const response = await db.query(text, values);
    return await response;
};

const getUserTournaments = async (userID) => {
    const text = "SELECT * FROM tournaments WHERE userid = $1";
    const values = [userID];
    return await db.query(text, values);
};

module.exports = { modelTournament, getTournament, getTournamentPage, getUserTournaments };
