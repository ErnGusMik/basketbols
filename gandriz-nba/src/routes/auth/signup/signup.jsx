import React from "react";
import "./signup.css";
import { Link } from "react-router-dom";
import login from "./../main.jpg";

export default function Email() {
  return (
    <div className="login">
      <img src={login} alt="Image of a basketball" className="loginImage" />
      <div className="sideContainer">
        <form className="loginContainer" action="#" method="GET">
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
          />
          <input type="submit" className="loginSubmit" value="Ienākt" />
        </form>
        <p className="noAccount">
          Ir konts? Ienāc <Link to="/login">šeit</Link>.
        </p>
        <p className="copy">&copy; Gandrīz NBA 2023</p>
      </div>
    </div>
  );
}
