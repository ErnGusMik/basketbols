import React from "react";

import { useParams } from "react-router-dom";

import "./stats.css";
import MainImage from "../../../../components/tournament-pages/main-image/main-image";

export default function TournamentStats() {
  // Set states
  const [tournament, setTournament] = React.useState({});
  const [teamBlocks, setTeamBlocks] = React.useState([]);
  const [team3p, setTeam3p] = React.useState([]);
  const [teamPoints, setTeamPoints] = React.useState([]);
  const [teamPointsAgainst, setTeamPointsAgainst] = React.useState([]);
  const [bestScorers, setBestScorers] = React.useState([]);
  const [bestBlockers, setBestBlockers] = React.useState([]);

  // Set vars & title
  const params = useParams();
  document.title = tournament.name
    ? "Statistika | " + tournament.name + " | Gandrīz NBA"
    : "Lādējās | Gandrīz NBA";

  // Get tournament data
  const getTournamentData = async () => {
    // Get tournament id from url
    const { id } = params;

    if (localStorage.getItem("tournament_" + id)) {
      setTournament(JSON.parse(localStorage.getItem("tournament_" + id)));
      return;
    }

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

  // Get tournament teams
  const getTournamentTeams = async () => {
    // Get tournament id from url
    const { id } = params;

    // Make request to API
    const request = await fetch(
      "http://localhost:8080/api/tournaments/" + id + "/teams",
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

    // Sort teams by stats
    const teamBlocks = response.sort((a, b) => {
      return b.avgblocks - a.avgblocks;
    });

    const team3p = response.sort((a, b) => {
      return b.avg3ppoints - a.avg3points;
    });

    const teamPoints = response.sort((a, b) => {
      return b.avgpoints - a.avgpoints;
    });

    const teamPointsAgainst = response.sort((a, b) => {
      return b.avglostpoints - a.avglostpoints;
    });

    // Set team data
    setTeamBlocks(teamBlocks);
    setTeam3p(team3p);
    setTeamPoints(teamPoints);
    setTeamPointsAgainst(teamPointsAgainst);
  };

  const getBestPlayers = async () => {
    // Get tournament id from url
    const { id } = params;

    // Make best scorers request to API
    const bestScorersRequest = await fetch(
      "http://localhost:8080/api/tournaments/" + id + "/stats/best-players",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      },
    );

    const bestScorersResponse = await bestScorersRequest.json();

    // Make best blockers request to API
    const bestBlockersRequest = await fetch(
      "http://localhost:8080/api/tournaments/" + id + "/stats/best-blockers",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      },
    );

    const bestBlockersResponse = await bestBlockersRequest.json();

    // Set best players data
    setBestScorers(bestScorersResponse.slice(0, 5));
    setBestBlockers(bestBlockersResponse.slice(0, 5));
  };

  // Get tournament & team data on load
  const runFunctions = async () => {
    await getTournamentData();
    await getTournamentTeams();
    await getBestPlayers();
  };

  React.useEffect(() => {
    runFunctions();
  }, []);

  return (
    <div className="tournamentStats">
      <div className="stickyContainer flexCont">
        <MainImage titleData={tournament.name ? tournament.name : ""} />
        <div className="descriptionCard">
          <p className="description">{tournament.description}</p>
          <div className="location">
            <i className="fa-solid fa-location-dot fa-lg" />
            <p className="locationText">{tournament.location}</p>
          </div>
          <p className="organizer">
            Organizē <b className="organizerName">{tournament.organizer}</b>
          </p>
        </div>
      </div>
      <div className="statCardContainer flexCont">
        <div className="statCard">
          <h2>Veiksmīgi bloki</h2>
          <div className="listContainer">
            <ol>
              {teamBlocks.map((team, index) => {
                return <li key={index}>{team.name}</li>;
              })}
            </ol>
            <ul>
              {teamBlocks.map((team, index) => {
                return <li key={index}>{team.avgblocks}</li>;
              })}
            </ul>
          </div>
        </div>
        <div className="statCard">
          <h2>Veiksmīgi 3p metieni</h2>
          <div className="listContainer">
            <ol>
              {team3p.map((team, index) => {
                return <li key={index}>{team.name}</li>;
              })}
            </ol>
            <ul>
              {team3p.map((team, index) => {
                return <li key={index}>{team.avg3points}</li>;
              })}
            </ul>
          </div>
        </div>
        <div className="statCard">
          <h2>Rezultatīvākie spēlētāji</h2>
          <div className="listContainer">
            <ol>
              {bestScorers.map((player, index) => {
                return (
                  <li key={index}>
                    {player.firstname} {player.lastname}
                  </li>
                );
              })}
            </ol>
            <ul>
              {bestScorers.map((player, index) => {
                return <li key={index}>{player.points}</li>;
              })}
            </ul>
          </div>
        </div>
        <div className="statCard">
          <h2>Labākie bloķētāji</h2>
          <div className="listContainer">
            <ol>
              {bestBlockers.map((player, index) => {
                return (
                  <li key={index}>
                    {player.firstname} {player.lastname}
                  </li>
                );
              })}
            </ol>
            <ul>
              {bestBlockers.map((player, index) => {
                return <li key={index}>{player.blocks}</li>;
              })}
            </ul>
          </div>
        </div>
        <div className="statCard">
          <h2>Punkti spēlē</h2>
          <div className="listContainer">
            <ol>
              {teamPoints.map((team, index) => {
                return <li key={index}>{team.name}</li>;
              })}
            </ol>
            <ul>
              {teamPoints.map((team, index) => {
                return <li key={index}>{team.avgpoints}</li>;
              })}
            </ul>
          </div>
        </div>
        <div className="statCard">
          <h2>Ielaistie punkti</h2>
          <div className="listContainer">
            <ol>
              {teamPointsAgainst.map((team, index) => {
                return <li key={index}>{team.name}</li>;
              })}
            </ol>
            <ul>
              {teamPointsAgainst.map((team, index) => {
                return <li key={index}>{team.avglostpoints}</li>;
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
