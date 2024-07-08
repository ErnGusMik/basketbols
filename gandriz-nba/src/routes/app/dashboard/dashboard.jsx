import React, { useEffect } from "react";

import "./dashboard.css";

import mainImg from "./main.jpg";
import Button from "../../../components/button/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [tournaments, setTournaments] = React.useState([]);
  const [name, setName] = React.useState("lietotāj");
  const [lang, setLang] = React.useState(Boolean(localStorage.getItem("lang")));

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

    setName(idToken.name);

    // Get all tournaments for this user
    const tournamentRequest = await fetch(
      "https://basketbols.onrender.com/api/" + idToken.sub + "/tournaments",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      },
    );
    const tournamentData = await tournamentRequest.json();

    // Get all games for each tournament
    const tournamentsArray = [];
    for (let i = 0; i < tournamentData.length; i++) {
      const gamesReq = await fetch(
        "https://basketbols.onrender.com/api/tournaments/" +
          tournamentData[i].id +
          "/games",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      const gamesData = await gamesReq.json();

      // Sort by date & time
      gamesData.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

      const now = new Date();
      const nextGameArr = [];
      const lastGameArr = [];

      // Get all agmes that have passed & all that will happen in the future
      for (let j = 0; j < gamesData.length; j++) {
        if (new Date(gamesData[j].date) > now) {
          nextGameArr.push(gamesData[j]);
        } else {
          lastGameArr.push(gamesData[j]);
        }
      }

      // Sort by date & time
      nextGameArr.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

      lastGameArr.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      const nextGame = nextGameArr[0];
      const lastGame = lastGameArr[0];

      // If nextGame exists, get team names
      if (nextGame) {
        const nextTeam1req = await fetch(
          "https://basketbols.onrender.com/api/teams/" + nextGame.team1id,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        const nextTeam1Data = await nextTeam1req.json();

        const nextTeam2req = await fetch(
          "https://basketbols.onrender.com/api/teams/" + nextGame.team2id,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        const nextTeam2Data = await nextTeam2req.json();

        nextGame.team1name = nextTeam1Data.name;
        nextGame.team2name = nextTeam2Data.name;
      }

      // If lastGame exists, get team names
      if (lastGame) {
        const prevTeam1req = await fetch(
          "https://basketbols.onrender.com/api/teams/" + lastGame.team1id,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        const prevTeam1Data = await prevTeam1req.json();

        const prevTeam2req = await fetch(
          "https://basketbols.onrender.com/api/teams/" + lastGame.team2id,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        const prevTeam2Data = await prevTeam2req.json();

        lastGame.team1name = prevTeam1Data.name;
        lastGame.team2name = prevTeam2Data.name;
      }

      // Push all data to the array
      tournamentsArray.push({
        name: tournamentData[i].name,
        location: tournamentData[i].location,
        startDate: new Date(JSON.parse(tournamentData[i].dates)[0]),
        endDate: new Date(JSON.parse(tournamentData[i].dates)[1]),
        organizer: tournamentData[i].organizer,
        logo: tournamentData[i].logo,
        nextGame: nextGame,
        lastGame: lastGame,
      });
    }

    // Set the state
    setTournaments(tournamentsArray);
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <div className="dashboard">
      <h1>
        {lang ? "Hi" : "Sveiks"}, {name}! {lang ? "Let's play!" : "Uzspēlējam?"}
      </h1>
      {tournaments.map((tournament) => {
        return (
          <div className="component">
            <div className="divider">
              <Link to="/app/tournaments/170">
                <img
                  src={tournament.logo ? tournament.logo : mainImg}
                  alt="Tournament logo"
                  className="logo"
                />
              </Link>
              <div className="tournamentData">
                <Link to="/app/tournaments/170">
                  <h2>{tournament.name}</h2>
                </Link>
                <div className="infoRow">
                  <i
                    className="fa-solid fa-location-dot"
                    style={{ fontWeight: 600 }}
                  ></i>
                  <p>{tournament.location}</p>
                </div>
                <div className="infoRow">
                  <i
                    className="fa-solid fa-calendar"
                    style={{ fontWeight: 300 }}
                  ></i>
                  <p>
                    {tournament.startDate.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {tournament.endDate.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <p>
                  {lang ? "Organized by" : "Organizē"} {tournament.organizer}
                </p>
              </div>
            </div>
            <div className="game">
              <h3>{lang ? "Next match" : "Nākamā spēle"}</h3>
              <p>{tournament.nextGame ? tournament.nextGame.team1name : ""}</p>
              <h4 style={{ textAlign: "center" }}>
                {tournament.nextGame
                  ? "VS"
                  : lang
                    ? "All matches have ended"
                    : "Visas spēles ir izspēlētas"}
              </h4>
              <p>{tournament.nextGame ? tournament.nextGame.team2name : ""}</p>
              {tournament.nextGame && (
                <Link
                  to={"/app/game/" + tournament.nextGame.id + "/instructions"}
                >
                  <Button text={lang ? "Prepare match" : "Sagatavot spēli"} />
                </Link>
              )}
            </div>
            <div className="game">
              <h3>{lang ? "Previous match" : "Pēdējā spēle"}</h3>
              <p>{tournament.lastGame ? tournament.lastGame.team1name : ""}</p>
              <h4 style={{ textAlign: "center" }}>
                {tournament.lastGame
                  ? "VS"
                  : lang
                    ? "No match has been finished yet"
                    : "Neviena spēle vēl nav izspēlēta"}
              </h4>
              <p>{tournament.lastGame ? tournament.lastGame.team2name : ""}</p>
              {tournament.lastGame && (
                <Link to={"/app/game/" + tournament.lastGame.id + "/analysis"}>
                  <Button text={lang ? "Match analysis" : "Spēles analīze"} />
                </Link>
              )}
            </div>
          </div>
        );
      })}
      <div className="newTournamentBtn">
        <Link to="/app/tournaments/new">
          <Button
            text={lang ? "New tournament" : "Jauns turnīrs"}
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
