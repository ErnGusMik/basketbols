/*
Structure:
Team1ID
Team2ID
Team1Points
Team2Points
RefereeIDs (seperated with ',')
Date  (varchar 'hh:mm dd/mm/yyyy')
TournamentID

team1Blocks
team13points (count not points)
team1LostPoints (points not count)
team12points (count not points)

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
const db = require("./../database/postgres.database");

const modelGame = async (
    team1ID,
    team2ID,
    team1Points,
    team2Points,
    refereeIDs,
    date,
    tournamentID,
    team1Blocks,
    team13points,
    team1LostPoints,
    team12points,
    team2Blocks,
    team23points,
    team2LostPoints,
    team22points,
    timesTied,
    timesLeadChanged,
    team2BiggestLead,
    team1BiggestLead,
    team1MostPointsInRow,
    team2MostPointsInRow,
    team1BestPlayers,
    team2BestPlayers,
    finals,
    group,
    venue,
    time
) => {
    const text =
        "INSERT INTO games (team1id, team2id, team1points, team2points, refereeids, date, tournamentid, team1blocks, team13points, team1lostpoints, team12points, team2blocks, team23points, team2lostpoints, team22points, timestied, timesleadchanged, team2biggestlead, team1biggestlead, team1mostpointsinrow, team2mostpointsinrow, team1bestplayers, team2bestplayers, finals, gamegroup, venue, time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27) RETURNING id";
    const values = [
        team1ID,
        team2ID,
        team1Points,
        team2Points,
        refereeIDs,
        date,
        tournamentID,
        team1Blocks,
        team13points,
        team1LostPoints,
        team12points,
        team2Blocks,
        team23points,
        team2LostPoints,
        team22points,
        timesTied,
        timesLeadChanged,
        team2BiggestLead,
        team1BiggestLead,
        team1MostPointsInRow,
        team2MostPointsInRow,
        team1BestPlayers,
        team2BestPlayers,
        finals,
        group,
        venue,
        time,
    ];
    return await db.query(text, values);
};

const updateGame = async (
    gameID,
    team1Points,
    team2Points,
    team1Blocks,
    team13points,
    team1LostPoints,
    team12points,
    team2Blocks,
    team23points,
    team2LostPoints,
    team22points,
    timesTied,
    timesLeadChanged,
    team2BiggestLead,
    team1BiggestLead,
    team1MostPointsInRow,
    team2MostPointsInRow,
    team1BestPlayers,
    team2BestPlayers,
) => {
    const text =
        "UPDATE games SET team1Points = $2, team2Points = $3, team1Blocks = $4, team13points = $5, team1LostPoints = $6, team12points = $7, team2Blocks = $8, team23points = $9, team2LostPoints = $10, team22points = $11, timesTied = $12, timesLeadChanged = $13, team2BiggestLead = $14, team1BiggestLead = $15, team1MostPointsInRow = $16, team2MostPointsInRow = $17, team1BestPlayers = $18, team2BestPlayers = $19 WHERE id = $1";
    const values = [
        gameID,
        team1Points,
        team2Points,
        team1Blocks,
        team13points,
        team1LostPoints,
        team12points,
        team2Blocks,
        team23points,
        team2LostPoints,
        team22points,
        timesTied,
        timesLeadChanged,
        team2BiggestLead,
        team1BiggestLead,
        team1MostPointsInRow,
        team2MostPointsInRow,
        team1BestPlayers,
        team2BestPlayers,
    ];
    return await db.query(text, values);
};

const addPublicID = async (gameID, publicID) => {
    const text = "UPDATE games SET public_id = $2 WHERE id = $1";
    const values = [gameID, publicID];
    return await db.query(text, values);
}

const getGame = async (gameID) => {
    const text = "SELECT * FROM games WHERE id = $1";
    const values = [gameID];
    return await db.query(text, values);
};

const getGamesInTournament = async (tournamentID) => {
    const text = "SELECT * FROM games WHERE tournamentid = $1";
    const values = [tournamentID];
    return await db.query(text, values);
};

// Public games

const modelPublicGame = async (
    userID,
    team1name,
    team2name,
    team1points,
    team2points,
    group,
    timeRemaining,
    venue,
    quarter,
    team1fouls,
    team2fouls,
    timestamp
) => {
    const text =
        "INSERT INTO game_public (user_id, team1_name, team2_name, team1_points, team2_points, game_group, game_time, venue, quarter, team1_fouls, team2_fouls, timestamp, paused, team1_fouls_details, team2_fouls_details) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id";
    const values = [
        userID,
        team1name,
        team2name,
        team1points,
        team2points,
        group,
        timeRemaining,
        venue,
        quarter,
        team1fouls,
        team2fouls,
        timestamp,
        true,
        JSON.stringify([]),
        JSON.stringify([]),
    ];
    return await db.query(text, values);
};

const updatePublicGame = async (
    gameID,
    team1points,
    team2points,
    timeRemaining,
    quarter,
    team1fouls,
    team2fouls,
    timestamp,
    paused,
    team1_timeouts,
    team2_timeouts,
    team1FoulDetails,
    team2FoulDetails,
    userID
) => {
    const text =
        "UPDATE game_public SET team1_points = $2, team2_points = $3, game_time = $4, quarter = $5, team1_fouls = $6, team2_fouls = $7, timestamp = $8, paused = $9, team1_timeouts = $10, team2_timeouts = $11, team1_fouls_details = $12, team2_fouls_details = $13 WHERE id = $1  AND user_id = $14";
    const values = [
        gameID,
        team1points,
        team2points,
        timeRemaining,
        quarter,
        team1fouls,
        team2fouls,
        timestamp,
        paused,
        team1_timeouts,
        team2_timeouts,
        team1FoulDetails,
        team2FoulDetails,
        userID,
    ];
    return await db.query(text, values);
};

const deletePublicGame = async (gameID, userID) => {
    const text = "DELETE FROM game_public WHERE id = $1 AND user_id = $2";
    const values = [gameID, userID];
    return await db.query(text, values);
};

const getPublicGame = async (gameID) => {
    const text = "SELECT * FROM game_public WHERE id = $1";
    const values = [gameID];
    return await db.query(text, values);
};

module.exports = {
    modelGame,
    updateGame,
    getGame,
    getGamesInTournament,
    modelPublicGame,
    updatePublicGame,
    deletePublicGame,
    getPublicGame,
    addPublicID
};
