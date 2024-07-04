// TODO: Put data in the dashboard components
// TODO: Customize greeting
// TODO: Move on to settings (at least add a coming soon page and logout option)

import React, { useEffect } from "react";

import "./dashboard.css";

import mainImg from "./main.jpg";
import Button from "../../../components/button/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [tournaments, setTournaments] = React.useState([]);
    // Function to decode JWTs
    const parseJwt = (token) => {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split("")
                .map((c) => {
                    return (
                        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join("")
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
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            }
        );
        const tournamentData = await tournamentRequest.json();
        console.log(tournamentData);

        const tournamentsArray = [];
        for (let i = 0; i < tournamentData.length; i++) {
            const gamesReq = await fetch(
                "http://localhost:8080/api/tournaments/" + tournamentData[i].id + "/games",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                }
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
        
        setTournaments(tournamentsArray);
    };

    React.useEffect(() => {
        getData();
    }, []);

    return (
        <div className="dashboard">
            <h1>Sveiks, Ernests! Uzspēlējam?</h1>
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
                            <p>{tournament.startDate.toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'})} - {tournament.endDate.toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'})}</p>
                        </div>
                        <p>Organizē {tournament.organizer}</p>
                    </div>
                </div>
                <div className="game">
                    <h3>Nākamā spēle</h3>
                    <p>{tournament.nextGame ? tournament.nextGame.team1id : ''}</p>
                    <h4 style={{textAlign: "center"}}>{tournament.nextGame ? 'VS' : 'Visas spēles ir izspēlētas'}</h4>
                    <p>{tournament.nextGame ? tournament.nextGame.team1id : ''}</p>
                    {tournament.nextGame && <Link to="/app">
                        <Button text="Sagatavot spēli" />
                    </Link>}
                </div>
                <div className="game">
                    <h3>Pēdējā spēle</h3>
                    <p>{tournament.lastGame ? tournament.lastGame.team1id : ''}</p>
                    <h4 style={{textAlign: "center"}}>{tournament.lastGame ? 'VS' : 'Neviena spēle vēl nav izspēlēta'}</h4>
                    <p>{tournament.lastGame ? tournament.lastGame.team1id : ''}</p>
                    {tournament.lastGame && <Link to="/app">
                        <Button text="Sagatavot spēli" />
                    </Link>}
                </div>
            </div>
                );
            })}
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
