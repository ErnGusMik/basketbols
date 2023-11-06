const db = require("./../database/postgres.database");

const verifyUserID = (userID) => {
  db.query("SELECT * FROM users WHERE id = $1", [userID])
    .then((result) => {
      if (result.rows.length === 0) {
        return false;
      }
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const verifyTournamentID = (tournamentID) => {
  db.query("SELECT * FROM tournaments WHERE id = $1", [tournamentID])
    .then((result) => {
      if (result.rows.length === 0) {
        return false;
      }
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const verifyTeamID = (teamID) => {
  db.query("SELECT * FROM teams WHERE id = $1", [teamID])
    .then((result) => {
      if (result.rows.length === 0) {
        return false;
      }
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}


module.exports = {
  verifyUserID,
  verifyTournamentID,
  verifyTeamID
};
