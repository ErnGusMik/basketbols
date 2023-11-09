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
  return await db.query(text, values);
};

const getUser = async (userID) => {
  const text = "SELECT * FROM users WHERE id = $1";
  const values = [userID];
  return await db.query(text, values);
};

const getUserByEmail = async (email) => {
  const text = "SELECT * FROM users WHERE email = $1";
  const values = [email];
  return await db.query(text, values);
}

module.exports = { modelUser, getUser, getUserByEmail };
