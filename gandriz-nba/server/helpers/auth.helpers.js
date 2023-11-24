const db = require("./../database/postgres.database");
const bcrypt = require("bcrypt");

const insertCode = async (code) => {
  const text =
    "INSERT INTO auth_codes (code, code_challenge, code_challenge_method, timestamp, user_id) VALUES ($1, $2, $3, $4, $5)";
  const values = [
    code.code,
    code.code_challenge,
    code.code_challenge_method,
    code.timestamp,
    code.user_id,
  ];
  return await db.query(text, values);
};

const removeCode = async (userID) => {
  const text = "DELETE FROM auth_codes WHERE user_id = $1";
  const values = [userID];
  return await db.query(text, values);
};

const verifyUser = async (email, password) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (result.err) {
    console.log(result.err.stack);
  } else {
    if (!result[0]) {
      return false;
    } else {
      const comparePass = await bcrypt.compare(
        password,
        result[0].password.toString(),
      );
      return comparePass;
    }
  }
  return result;
};

const checkUser = async (userID) => {
  const text = "SELECT * FROM auth_codes WHERE user_id = $1";
  const values = [userID];
  const result = await db.query(text, values);
  if (result.length === 0) {
    return false;
  } else {
    return true;
  }
};

const validateCode = async (code, timestamp) => {
  const codeVerification = await db.query(
    "SELECT * FROM auth_codes WHERE code = $1",
    [code],
    (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        if (res.rows.length === 0) {
          return false;
        } else {
          const codeDB = res.rows[0];
          if (codeDB.timestamp + 600000 < Date.now()) {
            return codeDB;
          } else {
            return false;
          }
        }
      }
    },
  );
  return codeVerification;
};

const validateCodeVerifier = async (
  code_challenge,
  code_verifier,
  code_challenge_method,
) => {
  const crypto = require("crypto-js/sha256");
  // Checks if code_challenge_method is S256
  if (code_challenge_method.toUpperCase() !== "S256") return false;
  // Encodes the code_verifier
  const code_verifier_encoded = btoa(crypto(code_verifier));
  // Returns true if they match, false if not
  if (code_verifier_encoded !== code_challenge) return false;
  return true;
};

async function generateHash(string) {
  const hash = await bcrypt.hash(string, 10);
  return hash.toString();
}

const getUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (result.err) {
    console.log(result.err.stack);
  } else {
    if (!result[0]) {
      return {
        error: "not_found",
      };
    }
    const response = {
      name: result[0].name,
      surname: result[0].surname,
      email: result[0].email,
      tournamentids: result[0].tournamentids,
      id: result[0].id,
    };
    return response;
  }
};

const getUserByID = async (id) => {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  if (result.err) {
    console.log(result.err.stack);
  } else {
    if (!result[0]) {
      return {
        error: "not_found",
      };
    }
    const response = {
      name: result[0].name,
      surname: result[0].surname,
      email: result[0].email,
      tournamentids: result[0].tournamentids,
      id: result[0].id,
    };
    return response;
  }
};

function makeRandom(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

module.exports = {
  insertCode,
  removeCode,
  checkUser,
  validateCode,
  validateCodeVerifier,
  verifyUser,
  generateHash,
  getUserByEmail,
  getUserByID,
  makeRandom,
};
