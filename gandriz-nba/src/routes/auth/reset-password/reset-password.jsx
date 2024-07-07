import React from "react";
import "./reset-password.css";
import { Link, useNavigate } from "react-router-dom";
import login from "./../main.jpg";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [lang, setLang] = React.useState(Boolean(localStorage.getItem("lang")));

  const changeLanguage = () => {
    if (localStorage.getItem("lang") === "en") {
      localStorage.removeItem("lang");
      setLang(false);
      return;
    }
    localStorage.setItem("lang", "en");
    setLang(true);
  };

  const manageReset = async (e) => {
    e.preventDefault();
    if (e.target.newPassword.value !== e.target.passwordConfirm.value) {
      document.getElementById("error-desc").innerText = "Paroles nav vienādas!";
      document.getElementById("error-cont").style.visibility = "visible";
      document.getElementById("error-cont").style.opacity = "1";
      setTimeout(() => {
        document.getElementById("error-cont").style.visibility = "hidden";
        document.getElementById("error-cont").style.opacity = "0";
      }, 3000);
      return;
    }
    if (e.target.newPassword.value.length < 8) {
      document.getElementById("error-desc").innerText = "Parole pārāk īsa!";
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
    const request = await fetch(
      "https://basketbols.onrender.com/auth/reset-password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
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
    navigate("/login");
  };
  return (
    <div className="login">
      <i className="fa-solid fa-globe" onClick={changeLanguage} />
      <img src={login} alt="Image of a basketball" className="loginImage" />
      <div className="sideContainer">
        <form
          className="loginContainer"
          action="#"
          method="GET"
          onSubmit={manageReset}
        >
          <h1>{lang ? "Reset password" : "Atjaunot paroli"}</h1>
          <label className="label" htmlFor="password">
            {lang ? "New password" : "Jaunā parole"}
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
            {lang ? "Confirm password" : "Atkārtot paroli"}
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
          <input
            type="submit"
            className="loginSubmit"
            value={lang ? "Reset password" : "Atjaunot paroli"}
          />
        </form>
        <p className="noAccount">
          {lang ? "Have an account? Log in" : "Ir konts? Ienāc"}{" "}
          <Link to="/login">{lang ? "here" : "šeit"}</Link>.
        </p>
        <p className="copy">&copy; Gandrīz NBA {new Date().getFullYear()}</p>
      </div>
      <div className="error-cont" id="error-cont">
        <i className="fa-solid fa-triangle-exclamation" />
        <p className="error-desc" id="error-desc">
          {lang ? "Something went wrong" : "Kaut kas nogāja greizi"}
        </p>
      </div>
    </div>
  );
}
