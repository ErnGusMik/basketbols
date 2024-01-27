// ! KEEP IN MIND: Server sends UTC date & time values. Convert to local time before displaying to user (new Date(*server data*))
// TODO: Set html values to data from API
// TODO: main nav, change highlight to each page

import React from "react";

import { useParams } from "react-router-dom";

import MainImage from "../../../../components/tournament-pages/main-image/main-image";
import Button from "../../../../components/button/button";
import Table from "../../../../components/tables/tables";

import logoImg from "./../../../../main.jpg";

import "./about.css";

export default function AboutTournament() {
  // Set states
  const [tournament, setTournament] = React.useState({});
  const [referees, setReferees] = React.useState([]);
  const [games, setGames] = React.useState({});

  // Set vars
  const params = useParams();
  document.title = tournament.name
    ? tournament.name + " | Gandrīz NBA"
    : "Lādējās" + " | Gandrīz NBA";

  // Get tournament data
  const getTournamentData = async () => {
    // Get tournament id from url
    const { id } = params;

    // Make request to API
    const request = await fetch("http://localhost:8080/api/tournaments/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    // Get response
    const response = await request.json();

    // Set tournament data
    setTournament(response);
  };

  // Get referees
  const getReferees = async () => {
    // Get tournament id from url
    const { id } = params;

    // Make request to API
    const request = await fetch(
      "http://localhost:8080/api/tournaments/" + id + "/referees",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      },
    );

    // Get response
    const response = await request.json();

    // Set referees
    setReferees(response);
  };

  // Get games
  const getGames = async () => {
    // Get tournament id from url
    const { id } = params;

    // Make request to API
    const request = await fetch(
      "http://localhost:8080/api/tournaments/" + id + "/games",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      },
    );

    // Get response
    const response = await request.json();

    let nextGame = {};
    let lastGame = {};

    for (let i = 0; i < response.length; i++) {
      if (
        new Date(response[i].date) > new Date(nextGame.date) ||
        !nextGame.date
      ) {
        nextGame = response[i];
      }

      if (
        new Date(response[i].date) < new Date(lastGame.date) ||
        !lastGame.date
      ) {
        lastGame = response[i];
      }
    }

    // Set games
    setGames({
      nextGame,
      lastGame,
    });
  };

  // Set referee table
  const setRefereeTable = () => {
    const refereeArray = [];

    referees.forEach((referee) => {
      let finals;

      if (referee.finals) {
        finals = (
          <span className="outer">
            <span className="inner"></span>
          </span>
        );
      } else {
        finals = <span className="outer"></span>;
      }

      refereeArray.push([referee.name, finals]);
    });

    return refereeArray;
  };

  React.useEffect(() => {
    getTournamentData();
    getReferees();
    getGames();
  }, []);

  React.useEffect(() => {
    tournament.dates = tournament.dates
      ? JSON.parse(tournament.dates).join(" - ") + " (UTC)"
      : "";
  }, [tournament]);

  React.useEffect(() => {
    console.log(games);
  }, [games]);

  return (
    <div className="aboutTournament">
      <div className="flexCol">
        <MainImage titleData={tournament.name ? tournament.name : ""} />
        <div className="descriptionCard">
          <p className="description">{tournament.description}</p>
          <div className="location">
            <i class="fa-solid fa-location-dot fa-lg"></i>
            <p className="locationText">{tournament.location}</p>
          </div>
          <p className="organizer">
            Organizē <b className="organizerName">{tournament.organizer}</b>
          </p>
        </div>
      </div>

      <div className="flexCol middleRow">
        <div className="gameCard">
          <h3 className="title">Nākamā spēle</h3>
          <div className="teamInfo">
            <div className="team">
              <img src={logoImg} alt="Team 1 logo" className="teamLogo" />
              <p className="teamName">Rīgas Valsts 1. ģimnāzija</p>
            </div>
            <div className="vs">VS</div>
            <div className="team">
              <img src={logoImg} alt="Team 2 logo" className="teamLogo" />
              <p className="teamName">Rīgas Valsts 1. ģimnāzija</p>
            </div>
          </div>
          <div className="gameData">
            <p>
              <b>A</b> grupa
            </p>
            <p>03/12/24</p>
            <p>21:30</p>
          </div>
          <div className="buttonDiv">
            <Button text="Sagatavot spēli" />
          </div>
        </div>
        <div className="refTable">
          <Table
            cols={["Vārds", "Izslēgšanas spēles"]}
            content={[...setRefereeTable()]}
            id="refTable"
          />
        </div>
      </div>

      <div className="flexCol">
        <div className="gameCard lastGame">
          <h3 className="title">Pēdējā spēle</h3>
          <div className="teamInfo">
            <div className="team">
              <img src={logoImg} alt="Team 1 logo" className="teamLogo" />
              <p className="teamName">Rīgas Valsts 1. ģimnāzija</p>
              <h3 className="score">94</h3>
            </div>
            <div className="vs">VS</div>
            <div className="team">
              <img src={logoImg} alt="Team 2 logo" className="teamLogo" />
              <p className="teamName">Rīgas Valsts 1. ģimnāzija</p>
              <h3 className="score">120</h3>
            </div>
          </div>
          <div className="gameData">
            <p>
              <b>A</b> grupa
            </p>
            <p>03/12/24</p>
            <p>21:30</p>
          </div>
          <div className="buttonDiv">
            <Button text="Spēles analīze" />
          </div>
        </div>
        <div className="rulesCont">
          <p>
            Turnīrs notiek pēc oficiāliem FIBA apstiprinātiem noteikumiem, kurus
            var apskatīt{" "}
            <a
              href="https://www.fiba.basketball/documents/official-basketball-rules/current.pdf"
              target="_blank"
              rel="noreferrer"
            >
              šeit
            </a>
            .
          </p>
          <div className="dates">
            <i class="fa-regular fa-calendar fa-lg"></i>
            <p>{tournament.dates}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
