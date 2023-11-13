import React from "react";
import "./email.css";
import { Link } from "react-router-dom";
import login from "./../main.jpg";

export default function Email() {
  return (
    <div className="login">
      <img src={login} alt="Image of a basketball" className="loginImage" />
      <div className="sideContainer">
        <div className="loginContainer">
          <h1>Ienākt ar epastu</h1>
          <input
            type="text"
            className="email loginInput"
            name="email"
            placeholder="john.doe@example.com"
          />
          <input
            type="password"
            className="password loginInput"
            name="password"
            placeholder="Parole"
          />
          <p className="forgotPassword">Aizmirsi paroli? Spied <Link to="/forgot-password">šeit</Link> lai atjaunotu.</p>
          <Link to="/">
            <button className="loginSubmit">
              <p>Ienākt</p>
            </button>
          </Link>
        </div>
        <p className="noAccount">
          Nav konta? Reģistrējies <Link to="/signup">šeit</Link>.
        </p>
        <p className="copy">&copy; Gandrīz NBA 2023</p>
      </div>
    </div>
  );
}
