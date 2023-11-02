/*
Structure:
ID
Name
TeamID
Number (in team)
Points
Blocks
*/

const modelPlayer = (id, name, teamID, number, points, blocks) => {
    const text = 'INSERT INTO players (id, name, teamID, number, points, blocks) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [id, name, teamID, number, points, blocks];
    return {
        text,
        values
    };
}

module.exports = modelPlayer;