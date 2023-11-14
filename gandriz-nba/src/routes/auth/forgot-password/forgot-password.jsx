import React from "react";
import "./../signup/signup.css";
import { Link } from "react-router-dom";
import login from "./../main.jpg";

export default function Email() {
  return (
    <div className="login">
      <img src={login} alt="Image of a basketball" className="loginImage" />
      <div className="sideContainer">
        <form className="loginContainer" action="#" method="GET">
          <h1>Aizmirsu paroli</h1>
          <label className="label" htmlFor="email">
            Konta epasts
          </label>
          <input
            type="email"
            className="email signupInput"
            name="email"
            placeholder="john.doe@example.com"
            id="email"
            required
          />
          <p className="forgotPassword">Jums tiks nosūtīts epasts uz norādīto adresi, kur varēsiet atjaunot paroli.</p>
          <input type="submit" className="loginSubmit" value="Sūtīt" />
        </form>
        <p className="noAccount">
          Ir konts? Ienāc <Link to="/login">šeit</Link>.
        </p>
        <p className="copy">&copy; Gandrīz NBA 2023</p>
      </div>
    </div>
  );
}
