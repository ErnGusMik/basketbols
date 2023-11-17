import React from "react";
import "./email.css";
import { Link } from "react-router-dom";
import login from "./../main.jpg";

const crypto = require("crypto-js/sha256");

// Access-Control-Allow-Origin header not present!!

export default function Email() {
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
  const createLoginParams = async () => {
    const state = makeRandom(10);
    const codeChallenge = makeRandom(64);
    const codeChallengeMethod = "S256";
    const codeVerifier = btoa(crypto(codeChallenge));
    return { state, codeChallenge, codeChallengeMethod, codeVerifier };
  };
  const manageCredentials = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const loginParams = await createLoginParams();
    const body = {
      email,
      password,
      state: loginParams.state,
      code_challenge: loginParams.codeChallenge,
      code_challenge_method: loginParams.codeChallengeMethod,
    };
    const request = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const response = await request.json();
    console.log(response);
    const tokenRequest = await fetch("http://localhost:8080/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: response.code,
        code_verifier: loginParams.codeVerifier,
        grant_type: "authorization_code",
      }),
    });
    const tokenResponse = await tokenRequest.json();
    console.log(tokenResponse);
  };

  return (
    <div className="login">
      <img src={login} alt="Image of a basketball" className="loginImage" />
      <div className="sideContainer">
        <form
          onSubmit={manageCredentials}
          method="GET"
          className="loginContainer"
        >
          <h1>Ienākt ar epastu</h1>
          <input
            type="email"
            className="email loginInput"
            name="email"
            placeholder="john.doe@example.com"
            required
          />
          <input
            type="password"
            className="password loginInput"
            name="password"
            placeholder="Parole"
            required
          />
          <p className="forgotPassword">
            Aizmirsi paroli? Spied <Link to="/forgot-password">šeit</Link> lai
            atjaunotu.
          </p>
          <input type="submit" className="loginSubmit" value="Ienākt" />
        </form>
        <p className="noAccount">
          Nav konta? Reģistrējies <Link to="/signup">šeit</Link>.
        </p>
        <p className="copy">&copy; Gandrīz NBA 2023</p>
      </div>
    </div>
  );
}
