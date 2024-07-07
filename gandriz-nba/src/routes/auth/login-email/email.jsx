import React from "react";
import "./email.css";
import { Link, useNavigate } from "react-router-dom";
import login from "./../main.jpg";

const crypto = require("crypto-js/sha256");

// Access-Control-Allow-Origin header not present!!

export default function Email() {
    const [lang, setLang] = React.useState(
        Boolean(localStorage.getItem("lang"))
    );

    const changeLanguage = () => {
        if (localStorage.getItem("lang") === "en") {
            localStorage.removeItem("lang");
            setLang(false);
            return;
        }
        localStorage.setItem("lang", "en");
        setLang(true);
    };

    const navigate = useNavigate();

    function makeRandom(length) {
        let result = "";
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
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
        const request = await fetch(
            "https://basketbols.onrender.com/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );
        const response = await request.json();
        if (response.error) {
            document.getElementById("error-desc").innerText =
                response.error_description;
            document.getElementById("error-cont").style.visibility = "visible";
            document.getElementById("error-cont").style.opacity = "1";
            setTimeout(() => {
                document.getElementById("error-cont").style.visibility =
                    "hidden";
                document.getElementById("error-cont").style.opacity = "0";
            }, 3000);
            return;
        }
        if (response.state !== loginParams.state) {
            document.getElementById("error-desc").innerText =
                "Nevarējām Jūs autorizēt (E13)";
            document.getElementById("error-cont").style.visibility = "visible";
            document.getElementById("error-cont").style.opacity = "1";
            setTimeout(() => {
                document.getElementById("error-cont").style.visibility =
                    "hidden";
                document.getElementById("error-cont").style.opacity = "0";
            }, 3000);
            return;
        }
        const tokenRequest = await fetch(
            "https://basketbols.onrender.com/auth/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: response.code,
                    code_verifier: loginParams.codeVerifier,
                    grant_type: "authorization_code",
                }),
            }
        );
        const tokenResponse = await tokenRequest.json();
        if (tokenResponse.error) {
            document.getElementById("error-desc").innerText =
                tokenResponse.error_description;
            document.getElementById("error-cont").style.visibility = "visible";
            document.getElementById("error-cont").style.opacity = "1";
            setTimeout(() => {
                document.getElementById("error-cont").style.visibility =
                    "hidden";
                document.getElementById("error-cont").style.opacity = "0";
            }, 3000);
            return;
        }
        localStorage.setItem("refresh_token", tokenResponse.refresh_token);
        localStorage.setItem("access_token", tokenResponse.access_token);
        localStorage.setItem("id_token", tokenResponse.id_token);
        navigate("/app");
    };

    return (
        <div className="login">
            <i className="fa-solid fa-globe" onClick={changeLanguage} />
            <img
                src={login}
                alt="Image of a basketball"
                className="loginImage"
            />
            <div className="sideContainer">
                <form
                    onSubmit={manageCredentials}
                    method="GET"
                    className="loginContainer"
                >
                    <h1>{lang ? "Log in with email" : "Ienākt ar epastu"}</h1>
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
                        placeholder={lang ? "Password" : "Parole"}
                        required
                    />
                    <p className="forgotPassword">
                        {lang
                            ? "Forgot password? Click"
                            : "Aizmirsi paroli? Spied"}{" "}
                        <Link to="/forgot-password">
                            {lang ? "here" : "šeit"}
                        </Link>{" "}
                        {lang ? "to reset it" : "lai atjaunotu"}.
                    </p>
                    <input
                        type="submit"
                        className="loginSubmit"
                        value="Ienākt"
                    />
                </form>
                <p className="noAccount">
                    {lang
                        ? "Don't have an account? Register "
                        : "Nav konta? Reģistrējies "}
                    <Link to="/signup">{lang ? "here" : "šeit"}</Link>.
                </p>
                <p className="copy">
                    &copy; Gandrīz NBA {new Date().getFullYear()}
                </p>
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
