const nodemailer = require("nodemailer");
const helpers = require("./../helpers/auth.helpers");
const model = require("./../models/users.models");
const db = require("./../database/postgres.database");
const Jwt = require("jsonwebtoken");
const path = require("node:path");
const fs = require("node:fs");

const loginVerify = async (req, res, next) => {
  // POST /api/auth/login
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.state ||
    !req.body.code_challenge ||
    !req.body.code_challenge_method
  ) {
    return res.status(400).send({
      error_technical_description: "Invalid request. Missing body parameters",
      error_description: "Kaut kas nogāja greizi (E1)",
      error: "invalid_request",
    });
  }
  const access_granted = await helpers.verifyUser(
    req.body.email,
    req.body.password,
  );
  if (!access_granted) {
    return res.status(401).send({
      error_technical_description: "Invalid credentials",
      error_description: "Nepareizs lietotājvārds vai parole (E2)",
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
        error_technical_description: "Unable to generate authorization code",
        error_description: "Kaut kas nogāja greizi (E3)",
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
  if (!req.body.grant_type || !req.body.code || !req.body.code_verifier) {
    return res.status(400).send({
      error_techincal_description: "Invalid request. Missing body parameters",
      error_description: "Kaut kas nogāja greizi (E1)",
      error: "invalid_request",
    });
  }

  if (req.body.grant_type !== "authorization_code") {
    return res.status(400).send({
      error_technical_description: "Unsupported grant_type",
      error_description: "Kaut kas nogāja greizi (E4)",
      error: "invalid_request",
    });
  } else if (req.body.grant_type == "authorization_code") {
    const codeArray = await helpers.validateCode(req.body.code, Date.now());
    const code = codeArray[0];
    if (!code) {
      return res.status(400).send({
        error_technical_description: "Invalid parameters or code timeout",
        error_description:
          "Drošības apsvērumu dēļ, nevarējām Jūs autorizēt (E5)",
        error: "invalid_request",
      });
    } else {
      const code_verifier = await helpers.validateCodeVerifier(
        code.code_challenge,
        req.body.code_verifier,
        code.code_challenge_method,
      );
      if (!code_verifier) {
        return res.status(400).send({
          error_technical_description:
            "code_verifier does not match encoded code_challenge or invalid method",
          error_description: "Kaut kas nogāja greizi (E6)",

          error: "invalid_request",
        });
      }
      const user = await helpers.getUserByID(code.user_id);
      if (!user) {
        return res.status(500).send({
          error_techincal_description:
            "We're having trouble finding you on our end. Something went wrong. Please try again later.",
          error_description: "Kaut kas nogāja greizi (E7)",

          error: "server_error",
        });
      }
      const accessToken = Jwt.sign(
        {
          sub: code.user_id,
          aud: "GandrizNBA",
          iss: "http://localhost:8080",
          exp: Date.now() + 3600000,
          iat: Date.now(),
          scope: req.body.scope ? req.body.scope : 0,
        },
        process.env.JWT_SECRET_KEY,
      );
      const refresh_token = Jwt.sign(
        {
          sub: code.user_id,
          aud: "GandrizNBA",
          iss: "http://localhost:8080",
          exp: Date.now() + 1000 * 60 * 60 * 24,
          iat: Date.now(),
          scope: req.body.scope ? req.body.scope : 0,
        },
        process.env.JWT_SECRET_KEY,
      );
      const IDtoken = Jwt.sign(
        {
          sub: code.user_id,
          aud: "GandrizNBA",
          iss: "http://localhost:8080",
          exp: Date.now() + 3600000,
          iat: Date.now(),
          name: user.name,
          email: user.email,
          last_name: user.surname,
        },
        process.env.JWT_SECRET_KEY,
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
      error_techincal_description: "Invalid email",
      error_description: "Nederīgs e-pasts (E8)",
      error: "invalid_request",
    });
  }
  if (!password || password.length < 8) {
    return res.status(400).send({
      error_technical_description: "Invalid password",
      error_description: "Nederīga parole (E9)",
      error: "invalid_request",
    });
  }
  if (!name) {
    return res.status(400).send({
      error_technical_description: "Invalid name",
      error_description: "Vārds pārāk īss (E10)",
      error: "invalid_request",
    });
  }
  if (!surname) {
    return res.status(400).send({
      error_techincal_description: "Invalid surname",
      error_description: "Uzvārds pārāk īss (E10)",
      error: "invalid_request",
    });
  }
  const hash = await helpers.generateHash(password);
  const testUser = await helpers.getUserByEmail(email);
  if (testUser.error === "not_found") {
    const query = await db.query(
      "INSERT INTO users (email, password, name, surname) VALUES ($1, $2, $3, $4) RETURNING email, id ",
      [email, hash, name, surname],
    );
    const result = query[0];
    const user = {
      email: result.email,
    };
    return res.status(201).send(user);
  }
  return res.status(400).send({
    error_techincal_description: "Email already exists",
    error_description: "Konts ar šādu e-pastu jau eksistē (E11)",
    error: "user_exists",
  });
};

const refresh = async (req, res, next) => {
  const refresh_token = req.body.refresh_token;
  if (!refresh_token) {
    return res.status(400).send({
      error_techincal_description: "Invalid request. Missing body parameters",
      error_description: "Kaut kas nogāja greizi (E1)",
      error: "invalid_request",
    });
  }
  const verify = Jwt.verify(refresh_token, process.env.JWT_SECRET_KEY);
  if (!verify) {
    return res.status(400).send({
      error_techincal_description: "Invalid refresh token",
      error_description: "Nevarējām Jūs autentificēt (E12)",
      error: "invalid_request",
    });
  }
  const token = Jwt.decode(refresh_token);
  const user = await helpers.getUserByID(token.sub);
  if (!user) {
    return res.status(400).send({
      error_technical_description: "Invalid refresh token",
      error_description: "Nevarējām Jūs autentificēt (E12)",
      error: "invalid_request",
    });
  }
  const accessToken = Jwt.sign(
    {
      sub: token.sub,
      aud: "GandrizNBA",
      iss: "http://localhost:8080",
      exp: Date.now() + 3600000,
      iat: Date.now(),
      scope: token.scope ? token.scope : 0,
    },
    process.env.JWT_SECRET_KEY,
  );
  const IDtoken = Jwt.sign(
    {
      sub: token.sub,
      aud: "GandrizNBA",
      iss: "http://localhost:8080",
      exp: Date.now() + 3600000,
      iat: Date.now(),
      name: user.name,
      email: user.email,
      last_name: user.surname,
    },
    process.env.JWT_SECRET_KEY,
  );
  const refresh = Jwt.sign(
    {
      sub: token.sub,
      aud: "GandrizNBA",
      iss: "http://localhost:8080",
      exp: Date.now() + 1000 * 60 * 60 * 24,
      iat: Date.now(),
      scope: token.scope ? token.scope : 0,
    },
    process.env.JWT_SECRET_KEY,
  );
  return res.status(200).send({
    access_token: accessToken,
    id_token: IDtoken,
    token_type: "Bearer",
    expires_in: 3600,
    refresh_token: refresh,
  });
};

const forgotPassword = async (req, res, next) => {
  // POST /auth/forgot-password
  const serverEmail = process.env.EMAIL;
  const serverPassword = process.env.EMAIL_PASSWORD;
  const email = req.body.email;
  const testEmail =
    /^(([a-zA-Z0-9]+)|([a-zA-Z0-9]+((?:\_[a-zA-Z0-9]+)|(?:\.[a-zA-Z0-9]+))*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,6}(?:\.[a-zA-Z]{2})?)$)/;

  if (!email || !testEmail.test(email)) {
    return res.status(400).send({
      error_technical_description:
        "Invalid request. Missing or invalid body parameters",
      error_description: "Kaut kas nogāja greizi (E1)",
      error: "invalid_request",
    });
  }

  const user = await helpers.getUserByEmail(email);
  if (user.error === "not_found") {
    return res.status(400).send({
      error_technical_description: "Invalid email",
      error_description: "Konts ar šādu e-pastu neeksistē (E11)",
      error: "user_not_found",
    });
  }
  const test = await db.query(
    "SELECT * FROM auth_codes WHERE user_id = $1 AND code_challenge = $2",
    [user.id, "0"],
  );
  if (test[0]) {
    db.query(
      "DELETE FROM auth_codes WHERE user_id = $1 AND code_challenge = $2",
      [user.id, "0"],
    );
  }

  const code = helpers.makeRandom(64);
  const dbText =
    "INSERT INTO auth_codes (code, code_challenge, code_challenge_method, timestamp, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING code, timestamp, user_id";
  const values = [code, "0", "0", Date.now(), user.id];

  const query = await db.query(dbText, values);

  const transporter = nodemailer.createTransport(
    `smtps://${serverEmail}:${serverPassword}@smtp.gmail.com`,
  );

  const mailOptions = {
    from: `GandrīzNBA Palīdzība <${serverEmail}>`,
    to: email,
    subject: "Atjauno savu GandrīzNBA konta paroli",
    // text:
    //   "Aizmirsāt paroli?\n\n" +
    //   "Lai atjaunotu savu paroli nospiediet uz šīs saites: http://localhost:3000/reset-password?code=" +
    //   code +
    //   "\n\nJa Jūs neesat pieprasījis paroles maiņu, tad ignorējiet šo e-pastu.\n\nAr cieņu,\nGandrīzNBA",
    html:
      "<style>@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap');*{font-family:'Montserrat';}.button:hover{background-color: #ECC2B1}</style>" +
      "<div style='background-color: #d3d3d3; width: 100%; height: 100%; text-align: center;'><div style='max-width: 80%; background-color: #fff; border-radius: 20px; display: inline-block; margin: 40px auto; padding: 30px;'><h1 style='font-weight: 900; font-size: 30px; text-align: center;'>Aizmirsāt paroli? Uztaisīsim jaunu!</h1>" +
      "<p style='font-weight: 300; text-align: left;'>Mēs saņēmām pieprasījumu nomainīt paroli uz kontu ar epastu <a href='mailto://ernests.mikuts@gmail.com' style='color: #EE6730'>" +
      email +
      "</a>.</p><p style='font-weight: 300; text-align: left;'>Ja Jūs neesat pieprasījis paroles maiņu, tad ignorējiet šo e-pastu.</p>" +
      "<div style='text-align: center'><a class='button' href='http://localhost:3000/reset-password?code=" +
      code +
      "' style='text-decoration: none; color: black; margin: 20px auto; cursor: pointer; display: inline-block; text-align: center; font-size: 20px; background-color: #f9cdbb; border-radius: 50px; font-weight: 300; padding: 15px 30px;'>Nomainīt paroli</a></div>" +
      "<p style='font-weight: 300; text-align: left;'>Ar cieņu,<br>GandrīzNBA</p></div></div>",
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        error_technical_description: "Unable to send email",
        error_description: "Kaut kas nogāja greizi (E13)",
        error: "server_error",
      });
    } else {
      return res.status(200).send({
        message: "Email sent",
      });
    }
  });
};

const resetPassword = async (req, res, next) => {
  // PUT /auth/reset-password
  const code = req.body.code;
  const password = req.body.password;
  if (!code || !password || password.length < 8) {
    return res.status(400).send({
      error_technical_description:
        "Invalid request. Missing or invalid body parameters",
      error_description: "Kaut kas nogāja greizi (E1)",
      error: "invalid_request",
    });
  }
  const test = await db.query(
    "SELECT * FROM auth_codes WHERE code = $1 AND code_challenge = $2",
    [code, "0"],
  );
  if (!test[0]) {
    return res.status(400).send({
      error_technical_description: "Invalid code",
      error_description: "Autorizācijas kods nav atrasts (E15)",
      error: "invalid_request",
    });
  }
  if (Date.now() > test[0].timestamp + 900) {
    return res.status(400).send({
      error_technical_description: "Code timeout",
      error_description: "Kods ir novecojis (E14)",
      error: "invalid_request",
    });
  }

  const user = await db.query("SELECT * FROM users WHERE id = $1", [
    test[0].user_id,
  ]);
  if (!user[0]) {
    return res.status(500).send({
      error_technical_description: "Unable to find user",
      error_description: "Kaut kas nogāja greizi (E16)",
      error: "server_error",
    });
  }
  const hash = await helpers.generateHash(password);
  db.query("UPDATE users SET password = $1 WHERE id = $2", [hash, user[0].id]);
  db.query("DELETE FROM auth_codes WHERE user_id = $1", [user[0].id]);
  return res.status(200).send({
    status: 204,
  });
};

module.exports = {
  loginVerify,
  token,
  signUp,
  refresh,
  forgotPassword,
  resetPassword,
};
