import React from "react";
import "./reset-password.css";
import { Link } from "react-router-dom";
import login from "./../main.jpg";


export default function ResetPassword() {
  const manageReset = async (e) => {
    e.preventDefault();
    if (e.target.newPassword.value !== e.target.passwordConfirm.value) {
      document.getElementById("error-desc").innerHTML =
        'Paroles nav vienādas!'
      document.getElementById("error-cont").style.visibility = "visible";
      document.getElementById("error-cont").style.opacity = "1";
      setTimeout(() => {
        document.getElementById("error-cont").style.visibility = "hidden";
        document.getElementById("error-cont").style.opacity = "0";
      }, 3000);
      return;
    }
    if (e.target.newPassword.value.length < 8) {
      document.getElementById("error-desc").innerHTML =
        'Parole pārāk īsa!'
      document.getElementById("error-cont").style.visibility = "visible";
      document.getElementById("error-cont").style.opacity = "1";
      setTimeout(() => {
        document.getElementById("error-cont").style.visibility = "hidden";
        document.getElementById("error-cont").style.opacity = "0";
      }, 3000);
      return;
    }
    const password = e.target.newPassword.value;
    const searchParams = new URLSearchParams(window.location.search);
    const body = {
      password,
      code: searchParams.get("code"),
    };
    const request = await fetch("http://localhost:8080/auth/reset-password", {
      method: "PUT",
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
    window.location.href = "/login";
  };
  return (
    <div className="login">
      <img src={login} alt="Image of a basketball" className="loginImage" />
      <div className="sideContainer">
        <form
          className="loginContainer"
          action="#"
          method="GET"
          onSubmit={manageReset}
        >
          <h1>Atjaunot paroli</h1>
          <label className="label" htmlFor="password">
            Jaunā parole
          </label>
          <input
            type="password"
            className="password signupInput"
            name="newPassword"
            placeholder="jY61i!@#"
            id="newPassword"
            required
            min="8"
          />
          <label className="label" htmlFor="passwordConfirm">
            Atkārtot paroli
          </label>
          <input
            type="password"
            className="password signupInput"
            name="passwordConfirm"
            placeholder="jY61i!@#"
            id="passwordConfirm"
            required
            min="8"
          />
          <input type="submit" className="loginSubmit" value="Atjaunot paroli" />
        </form>
        <p className="noAccount">
          Ir konts? Ienāc <Link to="/login">šeit</Link>.
        </p>
        <p className="copy">&copy; Gandrīz NBA 2023</p>
      </div>
      <div className="error-cont" id="error-cont">
        <i className="fa-solid fa-triangle-exclamation"></i>
        <p className="error-desc" id="error-desc">
          Kaut kas nogāja greizi
        </p>
      </div>
    </div>
  );
}
