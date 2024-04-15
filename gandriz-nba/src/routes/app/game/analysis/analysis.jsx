// TODO: test AND fix admin game page to collect correct statistics
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./analysis.css";
import image from "./main.jpg";

export default function Analysis() {
    const params = useParams();
    const navigate = useNavigate();

    const [gameData, setGameData] = useState({});
    const [teamData, setTeamData] = useState({});

    document.title = `${teamData.team1 ? teamData.team1 : "Lādējas..."} VS ${
        teamData.team2 ? teamData.team2 : "Lādējas..."
    } | Spēles analīze | Gandrīz NBA`;

    // Get game statistics data
    const getData = async () => {
        // Get data from API
        const request = await fetch(
            "http://localhost:8080/api/games/" + params.id,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const response = await request.json();
        console.log(response);
        setGameData(response[0]);

        if (
            !response[0].public_id ||
            response.length === 0 ||
            response[0].error
        ) {
            navigate("/app/game/not-found");
        }
        setTeamData((prev) => ({
            ...prev,
            team1id: response[0].team1id,
            team2id: response[0].team2id,
        }));
        return response[0].public_id;
    };

    // Get game live data for team names
    const getTeams = async (publicID) => {
        const request = await fetch(
            "http://localhost:8080/api/live/games/once/" + publicID,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const response = await request.json();
        setTeamData((prev) => ({
            ...prev,
            team1: response[0].team1_name,
            team2: response[0].team2_name,
        }));
    };
    // Get all data
    const final = async () => {
        const publicID = await getData();
        getTeams(publicID);
    };

    // Calculate best players from game data
    const calcBestPlayers = async () => {
        const team1 = JSON.parse(gameData.team1bestplayers);
        const team2 = JSON.parse(gameData.team2bestplayers);

        const team1players = {};
        const team2players = {};

        // Calculate how many points each player scored
        for (let i = 0; i < 3; i++) {
            const current = team1["points" + (i + 1)].split(";");

            if (!current[-1]) current.pop();
            console.log(current);

            for (let j = 0; j < current.length; j++) {
                if (current[j] in team1players) {
                    team1players[current[j]] += j + 1;
                } else {
                    team1players[current[j]] = j + 1;
                }
            }
        }

        for (let i = 0; i < 3; i++) {
            const current = team2["points" + (i + 1)].split(";");

            if (!current[-1]) current.pop();

            for (let j = 0; j < current.length; j++) {
                if (current[j] in team2players) {
                    team2players[current[j]] += j + 1;
                } else {
                    team2players[current[j]] = j + 1;
                }
            }
        }

        // Sort and get top 2 players
        const team1best = Object.entries(team1players)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2);
        const team2best = Object.entries(team2players)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2);

        // If only one player scored, add a placeholder
        if (team1best.length < 2) {
            for (let i = team1best.length; i < 2; i++) {
                team1best.push([100, 0]);
            }
        }

        if (team2best.length < 2) {
            for (let i = team2best.length; i < 2; i++) {
                team2best.push([100, 0]);
            }
        }

        // Get player data from API
        for (let i = 0; i < 2; i++) {
            const playerRequest = await fetch(
                i
                    ? "http://localhost:8080/api/players/batch/" +
                          teamData.team2id +
                          "/" +
                          team2best[0][0] +
                          "+" +
                          team2best[1][0]
                    : "http://localhost:8080/api/players/batch/" +
                          teamData.team1id +
                          "/" +
                          team1best[0][0] +
                          "+" +
                          team1best[1][0],
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const playerResponse = await playerRequest.json();

            // Show data
            if (i) {
                document.getElementById("team2players").innerText =
                    playerResponse
                        .map((player, index) =>
                            player.firstname === "Bez vārda"
                                ? team2best[index][0] !== 100
                                    ? team2best[index][0] + " (bez vārda)"
                                    : "-- --"
                                : team2best[index][0] +
                                  " " +
                                  player.firstname +
                                  " " +
                                  player.lastname
                        )
                        .join("\n");
                document.getElementById("team2players").classList.remove("skeleton");
            } else {
                document.getElementById("team1players").innerText =
                    playerResponse
                        .map((player, index) =>
                            player.firstname === "Bez vārda"
                                ? team1best[index][0] !== 100
                                    ? team1best[index][0] + " (bez vārda)"
                                    : "-- --"
                                : team1best[index][0] +
                                  " " +
                                  player.firstname +
                                  " " +
                                  player.lastname
                        )
                        .join("\n");
                document.getElementById("team1players").classList.remove("skeleton");
            }
        }
    };

    React.useEffect(() => {
        final();
    }, []);

    React.useEffect(() => {
        if (gameData.public_id) {
            calcBestPlayers();
        }
    }, [gameData]);

    return (
        <div className="analysis__cont">
            <div className="statRow top">
                <div className="team1__cont teamCont">
                    <img src={image} alt="Team1 Logo (default image)" />
                    <h2>{teamData.team1 ? teamData.team1 : "Lādējas..."}</h2>
                    <h1>{gameData.team1points ? gameData.team1points : "0"}</h1>
                </div>
                <div className="vs__cont">
                    <h2 className="vs">VS</h2>
                </div>
                <div className="team2__cont teamCont">
                    <img src={image} alt="Team2 Logo (default image)" />
                    <h2>{teamData.team2 ? teamData.team2 : "Lādējas..."}</h2>
                    <h1>{gameData.team2points ? gameData.team2points : "0"}</h1>
                </div>
            </div>
            <div className="statRow">
                <div className="statSection">
                    <p>Reizes neizšķirts</p>
                    <h2>{gameData.timestied ? gameData.timestied : "0"}x</h2>
                </div>
                <div className="statSection">
                    <p>Vadība mainās</p>
                    <h2>
                        {gameData.timesleadchanged ? gameData.timesleadchanged : "0"}x
                    </h2>
                </div>
            </div>
            <div className="statRow">
                <h4 className="statVal bestPlayers skeleton" id="team1players">
                    <br />
                    <br />
                </h4>
                <p className="statLabel">Rezultatīvākie spēlētāji</p>
                <h4 className="statVal bestPlayers skeleton" id="team2players">
                    <br />
                    <br />
                </h4>
            </div>
            <div className="statRow">
                <h4 className="statVal">
                    {gameData.team1biggestlead
                        ? gameData.team1biggestlead
                        : "0"}
                    p
                </h4>
                <p className="statLabel">Lielākais pārsvars</p>
                <h4 className="statVal">
                    {gameData.team2biggestlead
                        ? gameData.team2biggestlead
                        : "0"}
                    p
                </h4>
            </div>
            <div className="statRow">
                <h4 className="statVal">
                    {gameData.team13points
                        ? Math.floor(
                              (gameData.team13points / ((gameData.team1points - gameData.team12points*2 - gameData.team13points*3) + gameData.team12points + gameData.team13points)) *
                                  100
                          )
                        : "0"}
                    %
                </h4>
                <p className="statLabel">3p % no visiem metieniem</p>
                <h4 className="statVal">
                    {gameData.team23points
                        ? Math.floor(
                              (gameData.team23points / ((gameData.team2points - gameData.team22points*2 - gameData.team23points*3) + gameData.team22points + gameData.team23points)) *
                                  100
                          )
                        : "0"}
                    %
                </h4>
            </div>
            <div className="statRow">
                <h4 className="statVal">
                    {gameData.team12points
                        ? Math.floor(
                              (gameData.team12points / ((gameData.team1points - gameData.team12points*2 - gameData.team13points*3) + gameData.team12points + gameData.team13points)) *
                                  100
                          )
                        : "0"}
                    %
                </h4>
                <p className="statLabel">2p % no visiem metieniem</p>
                <h4 className="statVal">
                    {gameData.team22points
                        ? Math.floor(
                              (gameData.team22points / ((gameData.team2points - gameData.team22points*2 - gameData.team23points*3) + gameData.team22points + gameData.team23points)) *
                                  100
                          )
                        : "0"}
                    %
                </h4>
            </div>
            <div className="statRow">
                <h4 className="statVal">
                    {gameData.team1mostpointsinrow
                        ? gameData.team1mostpointsinrow
                        : "0"}
                    p
                </h4>
                <p className="statLabel">Garākais izrāviens</p>
                <h4 className="statVal">
                    {gameData.team2mostpointsinrow
                        ? gameData.team2mostpointsinrow
                        : "0"}
                    p
                </h4>
            </div>
            <div className="statRow">
                <h4 className="statVal">
                    {gameData.team1blocks ? gameData.team1blocks : "0"}
                </h4>
                <p className="statLabel">Bloki</p>
                <h4 className="statVal">
                    {gameData.team2blocks ? gameData.team2blocks : "0"}
                </h4>
            </div>
        </div>
    );
}
