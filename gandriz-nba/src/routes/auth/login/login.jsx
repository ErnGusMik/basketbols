import React from "react";
import "./login.css";
import { Link } from "react-router-dom";
import google from "./google.svg";
import facebook from "./facebook.svg";
import login from "./../main.jpg";
import apple from "./apple.svg";

export default function Login() {
  function handleCredentialResponse(response) {
    console.log(response);
  }
  return (
    <div className="login">
      <img src={login} alt="Image of a basketball" className="loginImage" />
      <div className="sideContainer">
        <div className="loginContainer">
          <h1>Ienākt</h1>
          {/* Google Sign In button */}
          <script src="https://accounts.google.com/gsi/client" />
          <div
            id="g_id_onload"
            data-client_id="114902243360-qe6gqj8req465d5jh9da61sil8ecpcqt.apps.googleusercontent.com"
            data-context="signin"
            data-ux_mode="popup"
            data-login_uri="http://localhost:3000/login"
            data-auto_prompt="false"
           />
          <div
            class="g_id_signin"
            data-type="standard"
            data-shape="pill"
            data-theme="outline"
            data-text="signin_with"
            data-size="large"
            data-logo_alignment="left"
           />
          {/* ------------------- */}
          <Link to="/">
            <button className="loginButton">
              <img src={google} alt="Google logo" className="buttonImage" />
              <p>Ienākt ar Google</p>
            </button>
          </Link>
          <Link to="/">
            <button className="loginButton">
              <img src={facebook} alt="Facebook logo" className="buttonImage" />
              <p>Ienākt ar Facebook</p>
            </button>
          </Link>
          <Link to="/">
            <button className="loginButton">
              <img src={apple} alt="Apple logo" className="buttonImage" />
              <p>Ienākt ar Apple</p>
            </button>
          </Link>
          <div className="divider">
            <hr />
            <p>vai</p>
            <hr />
          </div>
          <Link to="/login/email">
            <button className="loginButton">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABgElEQVR4nO2YsUoDQRCGP7QTYq8YtbMVC9/C0tbSNxBfwdLWUhvRJoKlT2DlK2hAAqJihHSRkYUNhOTW2du73C04H/wQQrL7z9z8d8uBYRiGYcyzBVwDA0Ba1sB7cZ6i6AJvGRiXGX0A2zEFXGZgVgJy3lQeMjAqATlvKkvAMTDMwLB4jYBTYJkSrAO3GZi/BzapwAHw0oLxV+AoxfBewXcd4BwYN2B87PfqRHqb4we4CCywCzwu0PwTsF+w7wpw5otTmb6Ehw2FfPRHSN0IP0/9NroALUQu5FcLDOlaYP3SBcR0KCXkqVc4qYAyM6oZn2RsNTFjlQqQiiGvowEqixiBMiGVpgqYqAdsBE61d17u8yzuP72E/WovQOtw3bdhlZRFtRmv80GoIhVVdJcpE1Jpu4CJ+sCJV7/GdVUkc6m0bVCsANrvstgI0X6nxUJMnlL5zsCkBPSl2087ITalm5gCdoDPDMzKjN4Dx/ZCuv6tXA6vF4e+89HmDcMwjP/DL2zQTZFAJMSaAAAAAElFTkSuQmCC"
                className="buttonImage"
              />
              <p>Ienākt ar e-pastu</p>
            </button>
          </Link>
        </div>
        <p className="noAccount">
          Nav konta? Reģistrējies <Link to="/signup">šeit</Link>.
        </p>
        <p className="copy">&copy; Gandrīz NBA 2023. Ikonas Icons8</p>
      </div>
    </div>
  );
}
