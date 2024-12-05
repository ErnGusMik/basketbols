// ! KEEP IN MIND: Server sends UTC date & time values. Convert to local time before displaying to user (new Date(*server data*))
import React from "react";

import { useNavigate, useParams, Link } from "react-router-dom";

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
  const [teams, setTeams] = React.useState([]);

  const [lang, setLang] = React.useState(Boolean(localStorage.getItem("lang")));

  React.useEffect(() => {
    window.addEventListener("storage", () => {
      setLang(Boolean(localStorage.getItem("lang")));
    });

    return () => {
      window.removeEventListener("storage", () => {
        setLang(Boolean(localStorage.getItem("lang")));
      });
    };
  }, []);

  // Set vars
  const params = useParams();
  document.title = tournament.name
    ? tournament.name + " | Gandrīz NBA"
    : (lang ? "Loading" : "Lādējās") + " | Gandrīz NBA";
  const navigate = useNavigate();

  // Get tournament data
  const getTournamentData = async () => {
    // Get tournament id from url
    const { id } = params;

    // Check if tournament data is saved in local storage
    if (localStorage.getItem("tournament_" + id)) {
      const data = JSON.parse(localStorage.getItem("tournament_" + id));
      if (
        !data.name ||
        !data.description ||
        !data.location ||
        !data.organizer ||
        !data.dates ||
        !data.finalsnum ||
        !data.groups ||
        !data.logo ||
        !data.pagename ||
        !data.refereenum
      ) {
        localStorage.removeItem("tournament_" + id);
        getTournamentData();
        return;
      }
      setTournament(data);
      return;
    }

    // Make request to API
    const request = await fetch(
      "https://basketbols.onrender.com/api/tournaments/" + id,
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

    // Set tournament data
    setTournament(response);

    // Save to local storage
    localStorage.setItem(
      "tournament_" + id,
      JSON.stringify({
        name: response.name,
        description: response.description,
        location: response.location,
        organizer: response.organizer,
        dates: response.dates,
        finalsnum: response.finalsnum,
        groups: response.groups,
        logo: response.logo,
        pagename: response.pagename,
        refereenum: response.refereenum,
      }),
    );
  };

  // Get referees
  const getReferees = async () => {
    // Get tournament id from url
    const { id } = params;

    // Make request to API
    const request = await fetch(
      "https://basketbols.onrender.com/api/tournaments/" + id + "/referees",
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
      "https://basketbols.onrender.com/api/tournaments/" + id + "/games",
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

    // Sort games by date
    response.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    // Get next game
    const nextGame = response.find((game) => {
      return new Date(game.date) > new Date();
    });

    // Get last game
    const lastGame = response.find((game) => {
      return new Date(game.date) < new Date();
    });

    // Set games
    setGames({
      nextGame,
      lastGame,
    });
  };

  const getTeams = async () => {
    // Check if games exist and if yes, get team ids
    let teamIDs = [];
    if (games.nextGame) {
      teamIDs.push(games.nextGame.team1id);
      teamIDs.push(games.nextGame.team2id);
    }
    if (games.lastGame) {
      teamIDs.push(games.lastGame.team1id);
      teamIDs.push(games.lastGame.team2id);
    }

    if (teamIDs.length === 0) return;

    if (localStorage.getItem("tournament_" + params.id + "_teams")) {
      const data = JSON.parse(
        localStorage.getItem("tournament_" + params.id + "_teams"),
      );

      setTeams(data);
      return;
    }

    // Make request to API
    const request = await fetch(
      "https://basketbols.onrender.com/api/teams/batch/" + teamIDs.join("+"),
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

    // Set teams
    setTeams(response);

    // Save to local storage
    const responseData = response.map((team) => {
      return {
        id: team.id,
        name: team.name,
        teamgroup: team.teamgroup,
        tournamentpoints: team.tournamentpoints,
        wins: team.wins,
        losses: team.losses,
        ties: team.ties,
      };
    });

    // Get tournament id from url
    const { id } = params;

    // Save to local storage
    localStorage.setItem(
      "tournament_" + id + "_teams",
      JSON.stringify(responseData),
    );
  };

  // Set referee table
  const setRefereeTable = () => {
    const refereeArray = [];

    referees.forEach((referee) => {
      let finals;

      if (referee.finals) {
        finals = (
          <span className="outer">
            <span className="inner" />
          </span>
        );
      } else {
        finals = <span className="outer" />;
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
    getTeams();
  }, [games]);

  // Functions to set html values
  const setGameCard = (game) => {
    let teamData = [];

    // Check if games exist, if not return so
    if ((game && !games.nextGame) || (!game && !games.lastGame))
      return (
        <div className="gameCard">
          <h3 className="title">
            {game ? (lang ? "Next" : "Nākamā") : lang ? "Previous" : "Pēdējā"}{" "}
            {lang ? "match" : "spēle"}
          </h3>
          <h2 className="noGame">
            {game
              ? lang
                ? "All matches have been played"
                : "Visas spēles jau ir izspēlētas"
              : lang
                ? "No match has begun yet"
                : "Neviena spēle vēl nav izspēlēta"}
          </h2>
        </div>
      );

    // Check if teams have been returned from API, if not retunr 'loading'
    if (teams.length > 0) {
      teamData = teams.filter((team) => {
        if (game) {
          return (
            team.id === games.nextGame.team1id ||
            team.id === games.nextGame.team2id
          );
        } else {
          return (
            team.id === games.lastGame.team1id ||
            team.id === games.lastGame.team2id
          );
        }
      });
    } else {
      return (
        <div className="gameCard">
          <h3 className="title">
            {game ? (lang ? "Next" : "Nākamā") : lang ? "Previous" : "Pēdējā"}{" "}
            {lang ? "match" : "spēle"}
          </h3>
          <h2 className="noGame">{"Lādējās..."}</h2>
        </div>
      );
    }

    // Set group letter from number
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const group = alphabet[teamData[0].teamgroup];

    // Return game card
    return (
      <div className={game ? "gameCard" : "gameCard lastGame"}>
        <h3 className="title">
          {game ? (lang ? "Next" : "Nākamā") : lang ? "Previous" : "Pēdējā"}{" "}
          {lang ? "match" : "spēle"}
        </h3>
        <div className="teamInfo">
          <div className="team">
            <img src={logoImg} alt="Team 1 logo" className="teamLogo" />
            <p className="teamName">{teamData[0].name}</p>
            <h3>{game ? "" : games.lastGame.team1points}</h3>
          </div>
          <div className="vs">VS</div>
          <div className="team">
            <img src={logoImg} alt="Team 2 logo" className="teamLogo" />
            <p className="teamName">{teamData[1].name}</p>
            <h3>{game ? "" : games.lastGame.team2points}</h3>
          </div>
        </div>
        <div className="gameData">
          <p>
            <b>{group}</b> {lang ? "group" : "grupa"}
          </p>
          <p>
            {/* Set date to correct format */}
            {game
              ? new Date(games.nextGame.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })
              : new Date(games.lastGame.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
          </p>
          <p>
            {/* Set time to correct format */}
            {game
              ? new Date(games.nextGame.time).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : new Date(games.lastGame.time).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
          </p>
        </div>
        <div className="buttonDiv">
          <Button
            text={
              game
                ? lang
                  ? "Prepare game"
                  : "Sagatavot spēli"
                : lang
                  ? "Game analysis"
                  : "Spēles analīze"
            }
            onClick={() => {
              game
                ? navigate("/app/game/" + games.nextGame.id + "/instructions")
                : navigate("/app/game/" + games.lastGame.id + "/analysis");
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="aboutTournament">
      <div className="flexCol">
        <MainImage titleData={tournament.name ? tournament.name : ""} />
        <div className="descriptionCard">
          <p className="description">{tournament.description}</p>
          <div className="location">
            <i className="fa-solid fa-location-dot fa-lg" />
            <p className="locationText">{tournament.location}</p>
          </div>
          <p className="organizer">
            {lang ? "Organised by" : "Organizē"}{" "}
            <b className="organizerName">{tournament.organizer}</b>
          </p>
        </div>
      </div>

      <div className="flexCol middleRow">
        {teams.length ? setGameCard(1) : setGameCard(1)}

        <div className="refTable">
          <Table
            cols={[
              lang ? "Name" : "Vārds",
              lang ? "Playoffs" : "Izslēgšanas spēles",
            ]}
            content={[...setRefereeTable()]}
            id="refTable"
          />
        </div>
      </div>

      <div className="flexCol">
        {teams.length ? setGameCard(0) : setGameCard(0)}

        <div className="rulesCont">
          <p>
            {lang
              ? "Thou tournament is taking place according to official basketball rules approved by FIBA, which can be viewed "
              : "Turnīrs notiek pēc oficiāliem FIBA apstiprinātiem noteikumiem, kurus var apskatīt "}
            <Link
              to="https://www.fiba.basketball/documents/official-basketball-rules/current.pdf"
              target="_blank"
              rel="noreferrer"
            >
              {lang ? "here" : "šeit"}
            </Link>
            .
          </p>
          <p>
            {lang ? "Public page: " : "Publiskā lapa: "}{" "}
            <Link to={"/" + tournament.pagename}>
              erngusmik.github.io/{tournament.pagename}
            </Link>
          </p>
          <div className="dates">
            <i className="fa-regular fa-calendar fa-lg" />
            <p>{tournament.dates}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
