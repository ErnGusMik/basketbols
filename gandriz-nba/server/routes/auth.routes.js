const helpers = require("./../helpers/auth.helpers");
const model = require("./../models/users.models");
const db = require("./../database/postgres.database");

const loginVerify = async (req, res, next) => {
  // POST /api/auth/login/verify
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.state ||
    !req.body.code_challenge ||
    !req.body.code_challenge_method
  ) {
    return res.status(400).send({
      error_description: "Invalid request. Missing body parameters",
      error: "invalid_request",
    });
  }
  const access_granted = await helpers.verifyUser(
    req.body.email,
    req.body.password
  );
  if (!access_granted) {
    return res.status(401).send({
      error_description: "Invalid credentials",
      error: "access_denied",
    });
  } else if (access_granted) {
    const user = await model.getUserByEmail(req.body.email);
    const checkCodeStatus = await helpers.checkUser(user[0].id);
    if (checkCodeStatus) {
      helpers.removeCode(user[0].id);
    }
    let code;
    try {
      code = require("node:crypto").randomBytes(64).toString("hex");
      const db_code = {
        code: code,
        code_challenge: req.body.code_challenge,
        code_challenge_method: req.body.code_challenge_method,
        timestamp: Date.now(),
        user_id: user[0].id,
      };
      await helpers.insertCode(db_code);
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        error_description: "Unable to generate authorization code",
        error: "server_error",
      });
    }
    return res.send({
      code,
      state: req.body.state,
    });
  }
};

const token = async (req, res) => {
  if (
    !req.body.grant_type ||
    !req.body.code ||
    !req.body.code_verifier
  ) {
    return res.status(400).send({
      error_description: "Invalid request. Missing body parameters",
      error: "invalid_request",
    });
  }

  if (req.body.grant_type !== "authorization_code") {
    return res.status(400).send({
      error_description: "Unsupported grant_type",
      error: "invalid_request",
    });
  } else if (req.body.grant_type == "authorization_code") {
    const codeArray = await helpers.validateCode(req.body.code, Date.now());
    const code = codeArray[0];
    console.log(code);
    if (!code) {
      return res.status(400).send({
        error_description: "Invalid parameters or code timeout",
        error: "invalid_request",
      });
    } else {
      const code_verifier = await helpers.validateCodeVerifier(
        code.code_challenge,
        req.body.code_verifier,
        code.code_challenge_method
      );
      if (!code_verifier) {
        return res.status(400).send({
          error_description:
            "code_verifier does not match encoded code_challenge or invalid method",
          error: "invalid_request",
        });
      }
      const accessToken = Jwt.sign(
        {
          sub: code.user_id,
          aud: req.body.client_id,
          iss: "http://localhost:8080",
          exp: Date.now() + 3600000,
          iat: Date.now(),
          scope: req.body.scope ? req.body.scope : 0,
        },
        process.env.JWT_SECRET_KEY
      );
      const user = helpers.getUser(code.user_id);
      if (!user) {
        return res.status(500).send({
          error_description:
            "We're having trouble finding you on our end. Something went wrong. Please try again later.",
          error: "server_error",
        });
      }
      const refresh_token = Jwt.sign(
        {
          sub: code.user_id,
          aud: req.body.client_id,
          iss: "http://localhost:8080",
          exp: Date.now() + 1000 * 60 * 60 * 24,
          iat: Date.now(),
          scope: req.body.scope ? req.body.scope : 0,
        },
        process.env.JWT_SECRET_KEY
      );
      const IDtoken = Jwt.sign(
        {
          sub: code.user_id,
          aud: req.body.client_id,
          iss: "http://localhost:8080",
          exp: Date.now() + 3600000,
          iat: Date.now(),
          name: user.name,
          email: user.email,
          last_name: user.surname,
        },
        process.env.JWT_SECRET_KEY
      );
      return res.status(200).send({
        access_token: accessToken,
        id_token: IDtoken,
        token_type: "Bearer",
        expires_in: 3600,
        refresh_token: refresh_token,
      });
    }
  }
};

const signUp = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const surname = req.body.surname;
  const testEmail =
    /^(([a-zA-Z0-9]+)|([a-zA-Z0-9]+((?:\_[a-zA-Z0-9]+)|(?:\.[a-zA-Z0-9]+))*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,6}(?:\.[a-zA-Z]{2})?)$)/;
  if (!testEmail.test(email)) {
    return res.status(400).send({
      error_description: "Invalid email",
      error: "invalid_request",
    });
  }
  if (!password || password.length < 8) {
    return res.status(400).send({
      error_description: "Invalid password",
      error: "invalid_request",
    });
  }
  if (!name) {
    return res.status(400).send({
      error_description: "Invalid name",
      error: "invalid_request",
    });
  }
  if (!surname) {
    return res.status(400).send({
      error_description: "Invalid surname",
      error: "invalid_request",
    });
  }
  const hash = await helpers.generateHash(password);
  const testUser = await helpers.getUserByEmail(email);
  if (testUser.error === "not_found") {
    const query = await db.query(
      "INSERT INTO users (email, password, name, surname) VALUES ($1, $2, $3, $4) RETURNING email, id ",
      [email, hash, name, surname]
    );
    const result = query[0];
    const user = {
      email: result.email
    };
    return res.status(201).send(user);
  }
  return res.status(400).send({
    error_description: "Email already exists",
    error: "user_exists",
  });
};

module.exports = { loginVerify, token, signUp };
