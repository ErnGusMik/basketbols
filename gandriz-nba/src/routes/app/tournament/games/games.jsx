// TODO: save server data to local storage for faster loading
// TODO: make playoffs appear only if there are any
import React from "react";
import { useParams } from "react-router-dom";

import MainImage from "../../../../components/tournament-pages/main-image/main-image";
import Table from "../../../../components/tables/tables";

import "./games.css";

export default function TournamentGames() {
  // Set states
  const [tournament, setTournament] = React.useState({});
  const [games, setGames] = React.useState([]);
  const [teams, setTeams] = React.useState([]);
  const [referees, setReferees] = React.useState([]);
  const [playoffs, setPlayoffs] = React.useState([]);

  // Set vars & title
  document.title = tournament.name
    ? "Spēles | " + tournament.name + " | Gandrīz NBA"
    : "Lādējās | Gandrīz NBA";
  const params = useParams();

  // Get tournament data from server
  const getTournamentData = async () => {
    // Get url param (tournamentID)
    const { id } = params;

    // Make request to server
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

  // Get game data
  const getGameData = async () => {
    // Get url param (tournamentID)
    const { id } = params;

    // Make request to server
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

    response.forEach((game) => {
      if (game.finals !== 0) {
        setPlayoffs((prev) => [...prev, game]);
      }
      response.slice(response.indexOf(game), 1);
    });

    // Set game data
    response.sort((a, b) => a.gamegroup - b.gamegroup);

    let gamesByGroups = Array.from({ length: response.length }, () => []);

    for (let i = 0; i < response.length; i++) {
      response.filter((game) => {
        if (game.gamegroup === i) {
          gamesByGroups[i].push(game);
        }
      });
    }

    gamesByGroups.forEach((group) => {
      group.sort((a, b) => a.gamedate - b.gamedate);
    });

    gamesByGroups = gamesByGroups.filter((el) => {
      return el.length > 0;
    });

    setGames(gamesByGroups);
  };

  // Get team data
  const getTeamsData = async () => {
    // Get url param (tournamentID)
    const { id } = params;

    // Make request to server
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

    // Set game data
    setTeams(response);
  };

  // Get referee data
  const getRefereeData = async () => {
    // Get url param (tournamentID)
    const { id } = params;

    // Make request to server
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

    // Set game data
    setReferees(response);
  };

  // useEffect can't be async, so run this function isnstead
  const final = async () => {
    await getTournamentData();
    await getTeamsData();
    await getGameData();
    await getRefereeData();
  };

  // Run on page load
  React.useEffect(() => {
    final();
  }, []);

  return (
    <div className="tournamentGames">
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
      <div className="tournamentGamesContainer flexCont">
        <div className="playoffsContainer">
          <div className="playoffs">
            <p>Ceturtdaļfināli</p>
            <table className="game">
              <tr>
                <td>0</td>
                <td>Test123</td>
              </tr>
              <tr>
                <td>0</td>

                <td>Test</td>
              </tr>
            </table>
            <table className="game">
              <tr>
                <td>0</td>
                <td>Test</td>
              </tr>
              <tr>
                <td>0</td>

                <td>Test</td>
              </tr>
            </table>
            <table className="game">
              <tr>
                <td>0</td>
                <td>Test</td>
              </tr>
              <tr>
                <td>0</td>

                <td>Test</td>
              </tr>
            </table>
            <table className="game">
              <tr>
                <td>0</td>
                <td>Test</td>
              </tr>
              <tr>
                <td>0</td>

                <td>Test</td>
              </tr>
            </table>
          </div>
          <div className="playoffs">
            <p>Pusfināli</p>
            <table className="game">
              <tr>
                <td>0</td>
                <td>Test</td>
              </tr>
              <tr>
                <td>0</td>

                <td>Test</td>
              </tr>
            </table>
            <table className="game">
              <tr>
                <td>0</td>
                <td>Test</td>
              </tr>
              <tr>
                <td>0</td>

                <td>Test</td>
              </tr>
            </table>
          </div>
          <div className="playoffs">
            <p>Fināls</p>
            <table className="game">
              <tr>
                <td>0</td>
                <td>Test</td>
              </tr>
              <tr>
                <td>0</td>

                <td>Test</td>
              </tr>
            </table>
          </div>
        </div>
        <div className="tableContainer">
          {games.map((group, index) => {
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

            return (
              <div>
                <p>
                  <b>{alphabet[index]}</b> grupa
                </p>
                <Table
                  cols={[
                    "Komanda",
                    "Komanda",
                    "Datums",
                    "Laiks",
                    "Vieta",
                    "Rezultāts",
                    "Tiesneši",
                  ]}
                  content={group.map((game) => {
                    const refArr = JSON.parse(game.refereeids);
                    const refs = referees.filter((ref) => {
                      return refArr.includes(ref.id);
                    });

                    const team1 = teams.filter((team) => {
                      return team.id === game.team1id;
                    })[0];

                    const team2 = teams.filter((team) => {
                      return team.id === game.team2id;
                    })[0];
                    return [
                      team1.name,
                      team2.name,
                      new Date(game.date).toLocaleDateString("en-GB", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                      }),
                      new Date(game.date).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                      game.venue,
                      game.team1points + " - " + game.team2points,
                      refs
                        .map((ref) => {
                          return ref.name;
                        })
                        .join(", "),
                    ];
                  })}
                  id={"gameTable-" + index}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
