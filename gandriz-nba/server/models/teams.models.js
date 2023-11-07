/*
Structure:
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

const db = require("../database/postgres.database");

const modelTeam = async (
  name,
  points,
  tournamentPoints,
  wins,
  losses,
  ties,
  avgPoints,
  avgBlocks,
  avg3points,
  AvgLostPoints,
  tournamentID
) => {
  const text =
    "INSERT INTO teams (name, points, tournamentPoints, wins, losses, ties, avgPoints, avgBlocks, avg3points, AvgLostPoints, tournamentID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id";
  const values = [
    name,
    points,
    tournamentPoints,
    wins,
    losses,
    ties,
    avgPoints,
    avgBlocks,
    avg3points,
    AvgLostPoints,
    tournamentID,
  ];
  return await db.query(text, values);
};

module.exports = modelTeam;
