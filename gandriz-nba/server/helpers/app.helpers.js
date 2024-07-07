const db = require("./../database/postgres.database");

const verifyUserID = async (userID) => {
    const result = await db
        .query("SELECT (id, name, surname, email) FROM users WHERE id = $1", [
            userID,
        ])
        .then((result) => {
            return Boolean(result)
        })
        .catch((err) => {
            console.log("Error " + err);
            return false;
        });
    return result;
};

const verifyTournamentID = async (tournamentID) => {
    const result = await db
        .query("SELECT * FROM tournaments WHERE id=$1", [tournamentID])
        .then((result) => {
            return Boolean(result.length)
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
    return result;
};

const verifyTournamentOwner = async (tournamentID, userID) => {
    const result = await db
        .query("SELECT * FROM tournaments WHERE id=$1 AND userid=$2", [
            tournamentID,
            userID,
        ])
        .then((result) => {
            return Boolean(result.length)
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
    return result;
};

const verifyTeamID = async (teamID) => {
    const result = await db
        .query("SELECT * FROM teams WHERE id = $1", [teamID])
        .then((result) => {
            return Boolean(result.length)
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
    return result;
};

const verifyTeamByName = async (teamName, tournamentID) => {
    const result = await db
        .query("SELECT id FROM teams WHERE name = $1 AND tournamentid = $2", [
            teamName,
            tournamentID,
        ])
        .then((result) => {
            return Boolean(result.length)
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
    return result;
};

const verifyRefereeID = async (refereeID) => {
    const result = await db
        .query("SELECT * FROM referees WHERE id = $1", [refereeID])
        .then((result) => {
            return Boolean(result.length)
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
    return result;
};

const verifyRefereeByName = async (refereeName, tournamentID) => {
    const result = await db
        .query("SELECT id FROM referees WHERE name = $1 AND tournamentid = $2", [refereeName, tournamentID])
        .then((result) => {
            return Boolean(result.length)
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
    return result;
};

module.exports = {
    verifyUserID,
    verifyTournamentID,
    verifyTeamID,
    verifyRefereeID,
    verifyTournamentOwner,
    verifyTeamByName,
    verifyRefereeByName
};
