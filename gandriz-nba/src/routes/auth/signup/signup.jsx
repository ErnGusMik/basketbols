import React from "react";
import "./signup.css";
import { Link } from "react-router-dom";
import login from "./../main.jpg";

const crypto = require("crypto-js/sha256");

export default function Signup() {
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
    const codeVerifier = makeRandom(64);
    const codeChallengeMethod = "S256";
    const codeChallenge = btoa(crypto(codeVerifier));
    return { state, codeChallenge, codeChallengeMethod, codeVerifier };
  };
  const manageSignup = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const surname = e.target.surname.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const loginParams = await createLoginParams();
    const body = {
      name,
      surname,
      email,
      password,
    };
    const request = await fetch("https://basketbols.onrender.com/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const response = await request.json();
    if (response.error) {
      document.getElementById("error-desc").innerHTML =
        response.error_description;
      document.getElementById("error-cont").style.visibility = "visible";
      document.getElementById("error-cont").style.opacity = "1";
      setTimeout(() => {
        document.getElementById("error-cont").style.visibility = "hidden";
        document.getElementById("error-cont").style.opacity = "0";
      }, 3000);
      return;
    }
    const loginRequest = await fetch("https://basketbols.onrender.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        state: loginParams.state,
        code_challenge: loginParams.codeChallenge,
        code_challenge_method: loginParams.codeChallengeMethod,
      }),
    });
    const loginResponse = await loginRequest.json();
    if (loginResponse.error) {
      document.getElementById("error-desc").innerHTML =
        loginResponse.error_description;
      document.getElementById("error-cont").style.visibility = "visible";
      document.getElementById("error-cont").style.opacity = "1";
      setTimeout(() => {
        document.getElementById("error-cont").style.visibility = "hidden";
        document.getElementById("error-cont").style.opacity = "0";
      }, 3000);
      return;
    }
    if (loginResponse.state !== loginParams.state) {
      document.getElementById("error-desc").innerHTML =
        "Nevarējām jūs autorizēt (E13)";
      document.getElementById("error-cont").style.visibility = "visible";
      document.getElementById("error-cont").style.opacity = "1";
      setTimeout(() => {
        document.getElementById("error-cont").style.visibility = "hidden";
        document.getElementById("error-cont").style.opacity = "0";
      }, 3000);
      return;
    }
    const tokenRequest = await fetch("https://basketbols.onrender.com/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: loginResponse.code,
        grant_type: "authorization_code",
        code_verifier: loginParams.codeVerifier,
      }),
    });
    const tokenResponse = await tokenRequest.json();
    if (tokenResponse.error) {
      document.getElementById("error-desc").innerHTML =
        tokenResponse.error_description;
      document.getElementById("error-cont").style.visibility = "visible";
      document.getElementById("error-cont").style.opacity = "1";
      setTimeout(() => {
        document.getElementById("error-cont").style.visibility = "hidden";
        document.getElementById("error-cont").style.opacity = "0";
      }, 3000);
      return;
    }
    localStorage.setItem("refresh_token", tokenResponse.refresh_token);
    localStorage.setItem("access_token", tokenResponse.access_token);
    localStorage.setItem("id_token", tokenResponse.id_token);
    window.location.href = "/app";
    return;
  };
  return (
    <div className="login">
      <img src={login} alt="Image of a basketball" className="loginImage" />
      <div className="sideContainer">
        <form
          className="loginContainer"
          action="#"
          method="GET"
          onSubmit={manageSignup}
        >
          <h1>Reģistrēties</h1>
          <label className="label" htmlFor="name">
            Vārds
          </label>
          <input
            type="text"
            className="name signupInput"
            name="name"
            placeholder="John"
            id="name"
            required
          />
          <label className="label" htmlFor="surname">
            Uzvārds
          </label>
          <input
            type="text"
            className="surname signupInput"
            name="surname"
            placeholder="Doe"
            id="surname"
            required
          />
          <label className="label" htmlFor="email">
            Epasts
          </label>
          <input
            type="email"
            className="email signupInput"
            name="email"
            placeholder="john.doe@example.com"
            id="email"
            required
          />
          <label className="label" htmlFor="password">
            Parole
          </label>
          <input
            type="password"
            className="password signupInput"
            name="password"
            placeholder="jY61i!@#"
            id="password"
            required
            min="8"
          />
          <input type="submit" className="loginSubmit" value="Reģistrēties" />
        </form>
        <p className="noAccount">
          Ir konts? Ienāc <Link to="/login">šeit</Link>.
        </p>
        <p className="copy">&copy; Gandrīz NBA 2023</p>
      </div>
      <div className="error-cont" id="error-cont">
        <i className="fa-solid fa-triangle-exclamation" />
        <p className="error-desc" id="error-desc">
          Kaut kas nogāja greizi
        </p>
      </div>
    </div>
  );
}
