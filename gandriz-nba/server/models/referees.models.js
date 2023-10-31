/*
Structure:
ID
TournamentID
Name
Finals
*/

const modelReferee = (id, tournamentID, name, finals) => {
    const text = 'INSERT INTO referees (id, tournamentID, name, finals) VALUES ($1, $2, $3, $4)';
    const values = [id, tournamentID, name, finals];
    return {
        text,
        values
    };
}

module.exports = modelReferee;