const db = require("./../database/postgres.database");

const verifyUserID = async (userID) => {
  const result = await db
    .query("SELECT (id, name, surname, email) FROM users WHERE id = $1", [
      userID,
    ])
    .then((result) => {
      if (!result) {
        return false;
      }
      return true;
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
      if (result.length === 0) {
        return false;
      }
      return true;
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
      if (result.length === 0) {
        return false;
      }
      return true;
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
      if (result.length === 0) {
        return false;
      }
      return true;
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
      if (result.length === 0) {
        return false;
      }
      return true;
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
};
