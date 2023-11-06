/*
Structure:
ID
Name
Surname
Email
Password
*/

const db = require("./../database/postgres.database");

const modelUser = async (id, name, surname, email, password) => {
  const text =
    "INSERT INTO users (id, name, surname, email, password) VALUES ($1, $2, $3, $4, $5)";
  const values = [id, name, surname, email, password];
  return await db(text, values);
};

module.exports = modelUser;
