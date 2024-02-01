import React from "react";
import { useParams } from "react-router-dom";

import MainImage from "../../../../components/tournament-pages/main-image/main-image";
import Table from "../../../../components/tables/tables";

import "./teams.css";

export default function TournamentTeams() {
  // Set states
  const [tournament, setTournament] = React.useState({});
  const [teams, setTeams] = React.useState([]);

  // Set vars & title
  const params = useParams();
  document.title = tournament.name
    ? "Komandas | " + tournament.name + " | Gandrīz NBA"
    : "Lādējās | Gandrīz NBA";

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

    // Sort by group into sub-arrays
    response.sort((a, b) => {
      return a.teamgroup - b.teamgroup;
    });

    let teamsInGroups = [];
    for (let i = 0; i < response.length; i++) {
      if (teamsInGroups[response[i].teamgroup] === undefined) {
        teamsInGroups[response[i].teamgroup] = [];
      }
      teamsInGroups[response[i].teamgroup].push(response[i]);
    }

    // Set tournament data
    setTeams(teamsInGroups);
  };

  // Get tournament & team data on load
  const runFunctions = async () => {
    await getTournamentData();
    await getTournamentTeams();
  };

  React.useEffect(() => {
    runFunctions();
  }, []);

  return (
    <div className="tournamentTeams">
      <div className="stickyContainer flexCont">
        <MainImage titleData={tournament.name ? tournament.name : ""} />
        <div className="descriptionCard">
          <p className="description">{tournament.description}</p>
          <div className="location">
            <i className="fa-solid fa-location-dot fa-lg"></i>
            <p className="locationText">{tournament.location}</p>
          </div>
          <p className="organizer">
            Organizē <b className="organizerName">{tournament.organizer}</b>
          </p>
        </div>
      </div>
      <div className="tableContainer flexCont">
        {teams.map((group, index) => {
          const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
          group.forEach((team) => (team.teamgroup = alphabet[index]));
          return (
            <div className="groupTable">
              <p>
                <b>{group[0].teamgroup}</b> grupa
              </p>
              <Table
                cols={[
                  "Nosaukums",
                  "Spēlētāji",
                  "Uzv.",
                  "Zaud.",
                  "Neizšķ.",
                  "Punkti",
                ]}
                content={group.map((team) => {
                  return [
                    team.name,
                    <a
                      href="#"
                      id={"viewPlayers-" + team.id + "-group-" + index}
                    >
                      skatīt
                    </a>,
                    team.wins,
                    team.losses,
                    team.ties,
                    team.tournamentpoints,
                  ];
                })}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
