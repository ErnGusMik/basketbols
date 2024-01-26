// TODO: Set html values to data from API
// TODO: verify API sends correct, non-empty values
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
    ? tournament.name
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
        new Date(response[i].time) > new Date(nextGame.time) ||
        !nextGame.time
      ) {
        nextGame = response[i];
      }

      if (
        new Date(response[i].time) < new Date(lastGame.time) ||
        !lastGame.time
      ) {
        lastGame = response[i];
      }
    }

    // Set games
    setGames({
      nextGame,
      lastGame,
    });

    console.log(nextGame);
    console.log(lastGame);
  };

  React.useEffect(() => {
    getTournamentData();
    getReferees();
    getGames();
  }, []);

  return (
    <div className="aboutTournament">
      <div className="flexCol">
        <MainImage titleData="Skolas čempionāts 2023 9. - 12. klasēm un skolotājiem" />
        <div className="descriptionCard">
          <p className="description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
            inventore asperiores magnam vero consequatur voluptate harum
            molestias maxime aperiam rem numquam repellendus quisquam natus
            ipsam vel consequuntur excepturi, quod sed.
          </p>
          <div className="location">
            <i class="fa-solid fa-location-dot fa-lg"></i>
            <p className="locationText">Rīga</p>
          </div>
          <p className="organizer">
            Organizē <b className="organizerName">Rīgas valsts 1. ģimnāzija</b>
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
            content={[
              [
                "Gatis Saliņš",
                <span className="outer">
                  <span className="inner"></span>
                </span>,
              ],
            ]}
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
            >
              šeit
            </a>
            .
          </p>
          <div className="dates">
            <i class="fa-regular fa-calendar fa-lg"></i>
            <p>03/12/23 - 12/02/24</p>
          </div>
        </div>
      </div>
    </div>
  );
}
