/*
Structure:
ID
Team1ID
Team2ID
Team1Points
Team2Points
RefereeIDs
Date
TournamentID
Blocks
3points
LostPoints
2points
TimesTied
TimesLeadChanged
BiggestLead
MostPointsInRow
BestPlayers
Finals
*/

const modelGame = (id, team1ID, team2ID, team1Points, team2Points, refereeIDs, date, tournamentID, blocks, threePoints, lostPoints, twoPoints, timesTied, timesLeadChanged, biggestLead, mostPointsInRow, bestPlayers, finals) => {
    const text = 'INSERT INTO games (id, team1ID, team2ID, team1Points, team2Points, refereeIDs, date, tournamentID, blocks, threePoints, lostPoints, twoPoints, timesTied, timesLeadChanged, biggestLead, mostPointsInRow, bestPlayers, finals) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)';
    const values = [id, team1ID, team2ID, team1Points, team2Points, refereeIDs, date, tournamentID, blocks, threePoints, lostPoints, twoPoints, timesTied, timesLeadChanged, biggestLead, mostPointsInRow, bestPlayers, finals];
    return {
        text,
        values
    };
}

module.exports = modelGame;