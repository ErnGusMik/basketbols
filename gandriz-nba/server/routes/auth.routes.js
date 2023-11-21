const helpers = require("./../helpers/auth.helpers");
const model = require("./../models/users.models");

const loginVerify = async (req, res, next) => {
  // POST /api/auth/login
  if (
    !req.body.username ||
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
    req.body.username,
    req.body.password
  );
  if (!access_granted) {
    return res.status(401).send({
      error_description: "Invalid credentials",
      error: "access_denied",
    });
  } else if (access_granted) {
    const user = await model.getUserByEmail(req.body.username);
    const checkCodeStatus = helpers.checkUser(user[0].id);
    if (!checkCodeStatus) {
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
    console.log(code);
    return res.send({
      code: code,
      state: req.body.state,
    });
    // return res.redirect(
    //   301,
    //   `http://localhost:3000?code=${encodeURIComponent(
    //     // TODO: change to req.body.redirect_uri
    //     code
    //   )}&state=${encodeURIComponent(req.body.state)}`
    // );
  }
};


const token = async (req, res) => {
  if (
    !req.body.grant_type ||
    !req.body.code ||
    !req.body.code_verifier ||
    !req.body.client_secret
  ) {
    return res
      .status(400)
      .send({
        error_description: "Invalid request. Missing body parameters",
        error: "invalid_request",
      });
  }

  if (req.body.grant_type !== "authorization_code") {
    return res
      .status(400)
      .send({
        error_description: "Unsupported grant_type",
        error: "invalid_request",
      });
  } else if (req.body.grant_type == "authorization_code") {

    const code = await helpers.validateCode(
      req.body.code,
      Date.now(),
    );
    if (!code) {
      return res
        .status(400)
        .send({
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
        return res
          .status(400)
          .send({
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
        return res
          .status(500)
          .send({
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
          last_name: user.last_name,
          gender: user.gender,
          birthdate: user.birthdate,
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

module.exports = { loginVerify, token };
