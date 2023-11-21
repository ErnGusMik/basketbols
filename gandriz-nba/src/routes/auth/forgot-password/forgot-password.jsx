import React from "react";
import "./../signup/signup.css";
import { Link } from "react-router-dom";
import login from "./../main.jpg";

export default function Email() {
  const manageSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    console.log(email);
    const request = await fetch("http://localhost:8080/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const response = await request.json();
    if (!response.error) {
      document.getElementById("error-desc").innerHTML = 'E-pasts nosūtīts';
      document.getElementById("error-cont").style.backgroundColor = "#39a845";
      document.getElementById("error-cont").style.visibility = "visible";
      document.getElementById("error-cont").style.opacity = "1";
      setTimeout(() => {
        document.getElementById("error-cont").style.visibility = "hidden";
        document.getElementById("error-cont").style.opacity = "0";
        document.getElementById("error-cont").style.backgroundColor = "red";

      }, 3000);
      return;
    } else {
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
  };
  return (
    <div className="login">
      <img src={login} alt="Image of a basketball" className="loginImage" />
      <div className="sideContainer">
        <form className="loginContainer" onSubmit={manageSubmit}>
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
          <p className="forgotPassword">
            Jums tiks nosūtīts epasts uz norādīto adresi, kur varēsiet atjaunot
            paroli.
          </p>
          <input
            type="submit"
            className="loginSubmit"
            value="Sūtīt"
            id="submit"
          />
        </form>
        <p className="noAccount">
          Ir konts? Ienāc <Link to="/login">šeit</Link>.
        </p>
        <p className="copy">&copy; Gandrīz NBA 2023</p>
      </div>
      <div className="error-cont" id="error-cont">
        <i className="fa-solid fa-triangle-exclamation"></i>
        <p className="error-desc" id="error-desc">
          Konts netika atrasts
        </p>
      </div>
    </div>
  );
}
