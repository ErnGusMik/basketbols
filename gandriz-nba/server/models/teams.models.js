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
    tournamentID,
    group,
    headCoach
) => {
    // Check if team already exists in this tournament
    const query = await db.query(
        "SELECT * FROM teams WHERE name = $1 AND tournamentid = $2",
        [name, tournamentID]
    );
    if (query.length > 0) {
        return {
            error: "Team already exists in this tournament",
            status: 400,
            severity: "ERROR",
            detail: 'Komanda jau eksistē šajā turnīrā!'
        };
    }

    const text =
        "INSERT INTO teams (name, allpoints, tournamentPoints, wins, losses, ties, avgpoints, avgblocks, avg3points, avglostpoints, tournamentid, teamgroup, headcoach) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id";
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
        group,
        headCoach,
    ];
    return await db.query(text, values);
};

const getTeam = async (teamID) => {
    const text = "SELECT * FROM teams WHERE id = $1";
    const values = [teamID];
    return await db.query(text, values);
};

module.exports = { modelTeam, getTeam };
