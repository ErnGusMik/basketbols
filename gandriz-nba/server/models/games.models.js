/*
Structure:
ID
Team1ID
Team2ID
Team1Points
Team2Points
RefereeIDs (seperated with ',')
Date  (varchar 'hh:mm dd/mm/yyyy')
TournamentID

team1Blocks
team13points
team1LostPoints
team12points

team2Blocks
team23points
team2LostPoints
team22points

TimesTied
TimesLeadChanged

team2BiggestLead
team1BiggestLead
team1MostPointsInRow
team2MostPointsInRow
team1BestPlayers (playerIDs seperated with ',')
team2BestPlayers (playerIDs seperated with ',')
Finals (0 if not, 4 for quarterfinals, 2 for semifinals, 1 for finals)
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