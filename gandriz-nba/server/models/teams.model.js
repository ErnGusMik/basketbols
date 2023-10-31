/*
Structure:
ID
Name
TournamentPoints
Wins
Losses
Ties
AvgPoints
AvgBlocks
Avg3points
AvgLostPoints
TournamentID
*/

const modelTeam = (id, name, points, tournamentPoints, wins, losses, ties, avgPoints, avgBlocks, avg3points, AvgLostPoints, tournamentID) => {
    const text = 'INSERT INTO teams (id, name, points, tournamentPoints, wins, losses, ties, avgPoints, avgBlocks, avg3points, AvgLostPoints, tournamentID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
    const values = [id, name, points, tournamentPoints, wins, losses, ties, avgPoints, avgBlocks, avg3points, AvgLostPoints, tournamentID];
    return {
        text,
        values
    };
}

module.exports = modelTeam;