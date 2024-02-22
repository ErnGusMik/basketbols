// TODO: add functionality to buttons, send to BOTH public and normal endpoints, check if updatePublicGame works as expected
// TODO: responsive design
// ! No need to follow design exactly -- that is for public page. This is for admin page.
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import KeyboardBtn from "./../../../../components/tournament-pages/keyboard/keyboard-button";
import StartAnimation from "../../../../components/game/start-anim/start-anim";

import "./game.css";

export default function Game() {
    // Set states and title
    document.title = "Admin | NULL vs NULL | Gandrīz NBA";
    const navigate = useNavigate();
    const params = useParams();

    const [gameData, setGameData] = React.useState({
        team1points: 0,
        team2points: 0,
    });

    const [instructions, setInstructions] = React.useState(
        <p>Lūdzu, mazliet pagaidiet! Mēs lādējam spēles informāciju!</p>
    );

    const [disabled, setDisabled] = React.useState(true);

    const [team1, setTeam1] = React.useState({
        name: "Lādējas...",
    });

    const [team2, setTeam2] = React.useState({
        name: "Lādējas...",
    });

    const [start, setStart] = React.useState(false);
    const [pause, setPause] = React.useState(true);
    const [time, setTime] = React.useState(600); // 10 minutes in seconds
    const [timeInterval, setTimeInterval] = React.useState(null);

    const [fouls, setFouls] = React.useState({
        team1: 0,
        team2: 0,
    });

    // Get game data from the server
    const getGame = async () => {
        const { id } = params;
        const request = await fetch(`http://localhost:8080/api/games/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        const response = await request.json();

        if (response.error || response.length === 0) {
            navigate("/app/game/not-found");
            return;
        }

        setInstructions(
            <p>
                Lai sāktu 10s laika atskaiti līdz spēles sākumam, spied{" "}
                <i className="fa-solid fa-play"></i> vai atsarpes taustiņu.
            </p>
        );

        setDisabled(false);

        setGameData(response[0]);
        console.log(response[0]);
        return [response[0].team1id, response[0].team2id];
    };

    // Get teams data from the server
    const getTeams = async (teamID, num) => {
        const request = await fetch(
            "http://localhost:8080/api/teams/" + teamID,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                        "access_token"
                    )}`,
                },
            }
        );
        const response = await request.json();

        if (response.error || response.length === 0) {
            navigate("/app/game/not-found");
            return;
        }

        if (num == 1) {
            setTeam1(response);
        } else {
            setTeam2(response);
        }
    };

    // Create public game
    const createPublicGame = async () => {
        const request = await fetch(
            "http://localhost:8080/api/games/new/public",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                        "access_token"
                    )}`,
                },
                body: JSON.stringify({
                    gameid: gameData.id,
                    team1name: team1.name,
                    team2name: team2.name,
                    timestamp: new Date().getTime(),
                }),
            }
        );

        const response = await request.json();
        console.log(response);
    };

    // Bring it all together
    const final = async () => {
        const teamIDs = await getGame();
        await getTeams(teamIDs[0], 1);
        await getTeams(teamIDs[1], 2);
    };

    React.useEffect(() => {
        if (!localStorage.getItem("access_token")) {
            navigate("/login");
        }
        final();
    }, []);

    React.useEffect(() => {
        if (gameData.id && team1.name !== 'Lādējas...' && team2.name !== 'Lādējas...') {
            createPublicGame();
        }
    }, [team1, team2]);

    // ! FUNCTIONALITY

    // Play/pause game
    const pauseHandler = () => {
        if (disabled) return;
        if (!start) {
            setStart(true);
            console.log(`[START] Game starting in 11 seconds.`);
            setInstructions(
                <p>
                    Spēle sākusies! Lai apturētu spēli, spied{" "}
                    <i className="fa-solid fa-pause"></i> vai atsarpes taustiņu.{" "}
                    <i className="fa-solid fa-circle-xmark"></i> - piezīme,{" "}
                    <i className="fa-solid fa-shield"></i> - bloks,{" "}
                    <i className="fa-solid fa-hourglass-start"></i> - 1min
                    pārtraukums.
                </p>
            );
            setTimeout(() => {
                setPause(false);
                setTimeInterval(
                    setInterval(() => {
                        setTime((prev) => prev - 1);
                    }, 1000)
                );
                console.log(
                    `[START] Game started at ${Date.now()} seconds since unix epoch.`
                );
            }, 11000);
            return;
        }
        if (!pause) {
            setPause(true);
            clearInterval(timeInterval);
            console.log(`[PAUSE] Game paused at ${time} seconds remaining.`);
            setInstructions(
                <p>
                    Spēle apturēta! Lai turpinātu spēli, spied{" "}
                    <i className="fa-solid fa-play"></i> vai atsarpes taustiņu.
                </p>
            );
            return;
        }
        if (pause && start) {
            setPause(false);
            setTimeInterval(
                setInterval(() => {
                    setTime((prev) => prev - 1);
                }, 1000)
            );
            console.log(`[RESUME] Game resumed at ${time} seconds remaining.`);
            setInstructions(
                <p>
                    Spēle turpinās! Lai apturētu spēli, spied{" "}
                    <i className="fa-solid fa-pause"></i> vai atsarpes taustiņu.{" "}
                    <i className="fa-solid fa-circle-xmark"></i> - piezīme,{" "}
                    <i className="fa-solid fa-shield"></i> - bloks,{" "}
                    <i className="fa-solid fa-hourglass-start"></i> - 1min
                    pārtraukums.
                </p>
            );
            return;
        }
    };

    return (
        <div className="game__container">
            <StartAnimation start={start} />

            <div className="gameFlex__container">
                <div className="flexCont team">
                    <h2>{team1.name}</h2>
                    <h1>{gameData.team1points}</h1>
                    <div className="btnCont">
                        <KeyboardBtn pointer text="+1" />
                        <KeyboardBtn pointer text="+2" />
                        <KeyboardBtn pointer text="+3" />
                    </div>
                    <div className="foul__container">
                        <span
                            className={
                                fouls.team1 >= 1 ? "foul active" : "foul"
                            }
                        ></span>
                        <span
                            className={
                                fouls.team1 >= 2 ? "foul active" : "foul"
                            }
                        ></span>
                        <span
                            className={
                                fouls.team1 >= 3 ? "foul active" : "foul"
                            }
                        ></span>
                        <span
                            className={
                                fouls.team1 >= 4 ? "foul active" : "foul"
                            }
                        ></span>
                        <span
                            className={
                                fouls.team1 >= 5 ? "foul active" : "foul"
                            }
                        ></span>
                    </div>
                    <div className="btnCont">
                        <KeyboardBtn
                            pointer
                            text={<i className="fa-solid fa-circle-xmark"></i>}
                        />
                        <KeyboardBtn
                            pointer
                            text={<i className="fa-solid fa-shield"></i>}
                        />
                        <KeyboardBtn
                            pointer
                            text={
                                <i className="fa-solid fa-hourglass-start"></i>
                            }
                        />
                    </div>
                </div>

                <div className="flexCont" id="adminGameInstructions">
                    <span
                        className={
                            disabled
                                ? "spaceBtn keyboardBtn disabled"
                                : "spaceBtn keyboardBtn"
                        }
                        id="gameSpaceBtn"
                        onClick={pauseHandler}
                    >
                        <i
                            className={
                                pause
                                    ? "fa-solid fa-play fa-xl"
                                    : "fa-solid fa-pause fa-xl"
                            }
                        ></i>
                    </span>
                    {instructions}
                </div>

                <div className="flexCont team team-right">
                    <h2>{team2.name}</h2>
                    <h1>{gameData.team2points}</h1>
                    <div className="btnCont">
                        <KeyboardBtn pointer text="+1" />
                        <KeyboardBtn pointer text="+2" />
                        <KeyboardBtn pointer text="+3" />
                    </div>
                    <div className="foul__container full">
                        <span
                            className={
                                fouls.team2 >= 1 ? "foul active" : "foul"
                            }
                        ></span>
                        <span
                            className={
                                fouls.team2 >= 2 ? "foul active" : "foul"
                            }
                        ></span>
                        <span
                            className={
                                fouls.team2 >= 3 ? "foul active" : "foul"
                            }
                        ></span>
                        <span
                            className={
                                fouls.team2 >= 4 ? "foul active" : "foul"
                            }
                        ></span>
                        <span
                            className={
                                fouls.team2 >= 5 ? "foul active" : "foul"
                            }
                        ></span>
                    </div>
                    <div className="btnCont">
                        <KeyboardBtn
                            pointer
                            text={<i className="fa-solid fa-circle-xmark"></i>}
                        />
                        <KeyboardBtn
                            pointer
                            text={<i className="fa-solid fa-shield"></i>}
                        />
                        <KeyboardBtn
                            pointer
                            text={
                                <i className="fa-solid fa-hourglass-start"></i>
                            }
                        />
                    </div>
                </div>
            </div>
            <div className="gameInfo">
                <h3>
                    {time % 60 > 9
                        ? (time - (time % 60)) / 60 + ":" + (time % 60)
                        : (time - (time % 60)) / 60 + ":" + "0" + (time % 60)}
                </h3>
                <h4>
                    <b>Periods 1</b>
                </h4>
                <p>
                    <b style={{ fontWeight: 900 }}>
                        {gameData.id
                            ? "ABCDEFGHIJKLMNOP"
                                  .split("")
                                  .slice(
                                      gameData.gamegroup,
                                      gameData.gamegroup + 1
                                  )[0]
                            : "N/A"}
                    </b>{" "}
                    grupa
                </p>
                <p>
                    {gameData.venue ? gameData.venue : "Turnīra galvenā arēna"}
                </p>
            </div>
        </div>
    );
}
