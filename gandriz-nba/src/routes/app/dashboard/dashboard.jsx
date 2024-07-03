// TODO: Put data in the dashboard components
// TODO: Customize greeting
// TODO: Move on to settings (at least add a coming soon page and logout option)

import React from "react";

import "./dashboard.css";

import mainImg from "./main.jpg";
import Button from "../../../components/button/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Function to decode JWTs
  const parseJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    return JSON.parse(jsonPayload);
  };

  const getData = async () => {
    const idTokenEncoded = localStorage.getItem("id_token");
    const idToken = parseJwt(idTokenEncoded);
    console.log(idToken.sub);
    const tournamentRequest = await fetch(
      "http://localhost:8080/api/" + idToken.sub + "/tournaments",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("id_token")}`,
        },
      },
    );
    const tournamentData = await tournamentRequest.json();
    console.log(tournamentData);
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <div className="dashboard">
      <h1>Sveiks, Ernests! Uzspēlējam?</h1>
      <div className="component">
        <div className="divider">
          <Link to="/app/tournaments/170">
            <img src={mainImg} alt="Tournament logo" className="logo" />
          </Link>
          <div className="tournamentData">
            <Link to="/app/tournaments/170">
              <h2>Skolas čempis 2023</h2>
            </Link>
            <div className="infoRow">
              <i
                className="fa-solid fa-location-dot"
                style={{ fontWeight: 600 }}
              ></i>
              <p>Ogre</p>
            </div>
            <div className="infoRow">
              <i
                className="fa-solid fa-calendar"
                style={{ fontWeight: 300 }}
              ></i>
              <p>01/12/23 - 10/12/2023</p>
            </div>
            <p>Organizē Ogres 1. vidusskola</p>
          </div>
        </div>
        <div className="game">
          <h3>Nākamā spēle</h3>
          <p>Čempionu koamnda</p>
          <h4>VS</h4>
          <p>Ogres SC</p>
          <Link to="/app">
            <Button text="Sagatavot spēli" />
          </Link>
        </div>
        <div className="game">
          <h3>Pēdējā spēle</h3>
          <p>Čempionu koamnda</p>
          <h4>VS</h4>
          <p>Ogres SC</p>
          <Link to="/app">
            <Button text="Spēles analīze" />
          </Link>
        </div>
      </div>
      <div className="newTournamentBtn">
        <Link to="/app/tournaments/new">
          <Button
            text="Jauns turnīrs"
            icon={
              <i
                className="fa-solid fa-plus"
                style={{ fontWeight: 300, marginRight: "5px" }}
              ></i>
            }
          />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
