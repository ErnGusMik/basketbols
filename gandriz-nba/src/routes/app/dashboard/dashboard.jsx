import React from "react";

import "./dashboard.css";

import mainImg from "./main.jpg";
import Button from "../../../components/button/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Sveiks, Ernests! Uzspēlējam?</h1>
      <div className="component">
        d
        <img src={mainImg} alt="Tournament logo" className="logo" />
        <div className="tournamentData">
          <h2>Skolas čempis 2023</h2>
          <div className="infoRow">
            <i
              className="fa-solid fa-location-dot"
              style={{ fontWeight: 600 }}
            ></i>
            <p>Ogre</p>
          </div>
          <div className="infoRow">
            <i className="fa-solid fa-calendar" style={{ fontWeight: 300 }}></i>
            <p>01/12/23 - 10/12/2023</p>
          </div>
          <p>Organizē Ogres 1. vidusskola</p>
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
      <Link to="/app/new-tournament">
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
  );
};

export default Dashboard;
