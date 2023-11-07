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
  finals
) => {
  const text =
    "INSERT INTO games (team1ID, team2ID, team1Points, team2Points, refereeIDs, date, tournamentID, team1Blocks, team13points, team1LostPoints, team12points, team2Blocks, team23points, team2LostPoints, team22points, timesTied, timesLeadChanged, team2BiggestLead, team1BiggestLead, team1MostPointsInRow, team2MostPointsInRow, team1BestPlayers, team2BestPlayers, finals) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 , $11, $12, $13, $14, $15, $16, $17, $18, $19, $20 , $21, $22, $23, $24, $25) RETURNING id";
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
  ];
  return await db(text, values);
};

const updateGame = async (
  gameID,
  team1Points,
  team2Points,
  refereeIDs,
  date,
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
  team2BestPlayers
) => {
  const text =
    "UPDATE games SET team1Points = $2, team2Points = $3, refereeIDs = $4, date = $5, team1Blocks = $6, team13points = $7, team1LostPoints = $8, team12points = $9, team2Blocks = $10, team23points = $11, team2LostPoints = $12, team22points = $13, timesTied = $14, timesLeadChanged = $15, team2BiggestLead = $16, team1BiggestLead = $17, team1MostPointsInRow = $18, team2MostPointsInRow = $19, team1BestPlayers = $20, team2BestPlayers = $21 WHERE gameID = $1";
  const values = [
    gameID,
    team1Points,
    team2Points,
    refereeIDs,
    date,
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

module.exports = {modelGame, updateGame};
