import React from "react";
import "./signup.css";
import { Link } from "react-router-dom";
import login from "./../main.jpg";

export default function Email() {

  const manageSignup = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const surname = e.target.surname.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const body = {
      name,
      surname,
      email,
      password,
    };
    const request = await fetch("http://localhost:8080/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const response = await request.json();
    console.log(response);
  }
  return (
    <div className="login">
      <img src={login} alt="Image of a basketball" className="loginImage" />
      <div className="sideContainer">
        <form className="loginContainer" action="#" method="GET" onSubmit={manageSignup}>
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
