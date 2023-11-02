/*
Structure:
ID
Name
Surname
Email
Password
*/
const modelUser = (id, name, surname, email, password) => {
    const text = 'INSERT INTO users (id, name, surname, email, password) VALUES ($1, $2, $3, $4, $5)';
    const values = [id, name, surname, email, password];
    return {
        text,
        values
    };
}

module.exports = modelUser;