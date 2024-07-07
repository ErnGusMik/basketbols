import React from "react";
import "./../signup/signup.css";
import { Link } from "react-router-dom";
import login from "./../main.jpg";

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

    const manageSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        console.log(email);
        const request = await fetch(
            "https://basketbols.onrender.com/auth/forgot-password",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            }
        );
        const response = await request.json();
        if (!response.error) {
            document.getElementById("error-desc").innerText = lang
                ? "Email sent"
                : "E-pasts nosūtīts";
            document.getElementById("error-cont").style.backgroundColor =
                "#39a845";
            document.getElementById("error-cont").style.visibility = "visible";
            document.getElementById("error-cont").style.opacity = "1";
            setTimeout(() => {
                document.getElementById("error-cont").style.visibility =
                    "hidden";
                document.getElementById("error-cont").style.opacity = "0";
                document.getElementById("error-cont").style.backgroundColor =
                    "red";
            }, 3000);
            return;
        } else {
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
                <form className="loginContainer" onSubmit={manageSubmit}>
                    <h1>{lang ? "Forgot password" : "Aizmirsu paroli"}</h1>
                    <label className="label" htmlFor="email">
                        {lang ? "Account email" : "Konta epasts"}
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
                        {lang
                            ? "You will receive an email, where you will be able to reset your password"
                            : "Jums tiks nosūtīts epasts uz norādīto adresi, kur varēsiet atjaunot paroli"}
                        .
                    </p>
                    <input
                        type="submit"
                        className="loginSubmit"
                        value={lang ? "Send" : "Sūtīt"}
                        id="submit"
                    />
                </form>
                <p className="noAccount">
                    {lang ? "Have an account? Log in" : "Ir konts? Ienāc"}{" "}
                    <Link to="/login">{lang ? "here" : "šeit"}</Link>.
                </p>
                <p className="copy">
                    &copy; Gandrīz NBA {new Date().getFullYear()}
                </p>
            </div>
            <div className="error-cont" id="error-cont">
                <i className="fa-solid fa-triangle-exclamation" />
                <p className="error-desc" id="error-desc">
                    {lang ? "Account not found" : "Konts netika atrasts"}
                </p>
            </div>
        </div>
    );
}
