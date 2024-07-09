import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import KeyboardBtn from "./../../../../components/tournament-pages/keyboard/keyboard-button";
import StartAnimation from "../../../../components/game/start-anim/start-anim";

import "./game.css";

export default function Game() {
    // Set react hooks
    const navigate = useNavigate();
    const params = useParams();
    const timer = useRef();
    const timer24s = useRef();

    // Set states
    const [lang, setLang] = React.useState(
        Boolean(localStorage.getItem("lang"))
    );

    const [gameData, setGameData] = React.useState({
        team1points: 0,
        team2points: 0,
    });

    const [statisticsData, setStatisticsData] = React.useState({
        team1: {
            mostPointsInRow: 0,
            biggestLead: 0,
            currentPointsInRow: 0,
        },
        team2: {
            mostPointsInRow: 0,
            biggestLead: 0,
            currentPointsInRow: 0,
        },
        previousTeam: null,
    });

    const [instructions, setInstructions] = React.useState(
        <p>Lūdzu, mazliet pagaidiet! Mēs lādējam spēles informāciju!</p>
    );

    const [disabled, setDisabled] = React.useState(true);

    const [team1, setTeam1] = React.useState({
        name: lang ? "Loading..." : "Lādējas...",
    });

    const [team2, setTeam2] = React.useState({
        name: lang ? "Loading..." : "Lādējas...",
    });

    const [start, setStart] = React.useState(false);
    const [pause, setPause] = React.useState(true);
    const [time, setTime] = React.useState(6000); // 10 minutes in deciseconds
    const [timeoutTime, setTimeoutTime] = React.useState(60); // 1 minute in seconds
    const [time24s, setTime24s] = React.useState(240); // 24 seconds in deciseconds
    const [quarter, setQuarter] = React.useState(1);

    const [fouls, setFouls] = React.useState({
        team1: 0,
        team2: 0,
        team1details: [],
        team2details: [],
    });

    const [timeouts, setTimeouts] = React.useState({
        team1: 0,
        team2: 0,
    });

    const [foulModalContent, setFoulModalContent] = React.useState(null);
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

    const [getUpdates, setGetUpdates] = React.useState(false);

    // Set title
    document.title =
        team1.id && team2.id
            ? `${lang ? "Match" : "Spēle"} | ${team1.name} vs ${
                  team2.name
              } | Gandrīz NBA`
            : (lang ? "Match loading" : "Lādējam spēli") + " | Gandrīz NBA";

    // Set refs
    const playButton = useRef();

    // Change languege
    const changeLanguage = () => {
        if (localStorage.getItem("lang") === "en") {
            localStorage.removeItem("lang");
            window.dispatchEvent(new Event("storage"));
            setLang(false);
            return;
        }
        localStorage.setItem("lang", "en");
        window.dispatchEvent(new Event("storage"));
        setLang(true);
    };

    // Get game data from the server
    const getGame = async () => {
        const { id } = params;
        let request;
        try {
            request = await fetch(
                `https://basketbols.onrender.com/api/games/${id}`,
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
        } catch (error) {
            console.error("[CRITICAL] Failed to fetch game data from server.");
            console.log(error);
            setInstructions(
                <p>
                    {lang
                        ? "An error has occured. Refresh the page or contact support."
                        : "Ir notikusi kļūda. Atsvaidzini lapu vai sazinies ar atbalstu."}
                </p>
            );
            throw new Error("Failed to fetch game data from server.");
        }
        const response = await request.json();

        if (response.error || response.length === 0 || !response[0]) {
            navigate("/app/game/not-found");
            return;
        }

        setInstructions(
            <p>
                {lang
                    ? "To start a 10s countdown until match start, click"
                    : "Lai sāktu 10s laika atskaiti līdz spēles sākumam, spied"}{" "}
                <i className="fa-solid fa-play" />{" "}
                {lang ? "or press the space button." : "vai atsarpes taustiņu."}
            </p>
        );

        setGameData(response[0]);
        return [response[0].team1id, response[0].team2id];
    };

    // Get teams data from the server
    const getTeams = async (teamID, num) => {
        const request = await fetch(
            "https://basketbols.onrender.com/api/teams/" + teamID,
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
        if (gameData.public_id) {
            const request = await fetch(
                "https://basketbols.onrender.com/api/live/games/once/" +
                    gameData.public_id,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            let response = await request.json();
            response = response[0];

            setQuarter(response.quarter);
            setGameData((prev) => ({
                ...prev,
                team1points: response.team1_points,
                team2points: response.team2_points,
            }));

            setFouls((prev) => ({
                ...prev,
                team1: response.team1_fouls,
                team2: response.team2_fouls,
                team1details: JSON.parse(response.team1_fouls_details),
                team2details: JSON.parse(response.team2_fouls_details),
            }));

            setTimeouts((prev) => ({
                ...prev,
                team1: response.team1_timeouts,
                team2: response.team2_timeouts,
            }));

            if (response.paused) {
                if (response.game_time >= 6000 && response.quarter === 1) {
                    setStart(false);
                    setInstructions(
                        <p>
                            {lang
                                ? "To start a 10s countdown until match start, click"
                                : "Lai sāktu 10s laika atskaiti līdz spēles sākumam, spied"}{" "}
                            <i className="fa-solid fa-play" />{" "}
                            {lang
                                ? "or press the space button."
                                : "vai atsarpes taustiņu."}
                        </p>
                    );
                } else {
                    setStart("true");
                    setInstructions(
                        <p>
                            Spēle apturēta! Lai turpinātu spēli, spied{" "}
                            <i className="fa-solid fa-play" /> vai atsarpes
                            taustiņu.
                        </p>
                    );
                    setInstructions(
                        <p>
                            {lang
                                ? "Match paused! To continue the match, click"
                                : "Spēle apturēta! Lai turpinātu spēli, spied"}{" "}
                            <i className="fa-solid fa-play" />{" "}
                            {lang
                                ? "or press the space button."
                                : "vai atsarpes taustiņu."}
                        </p>
                    );
                }
                setPause(true);
                setTime(response.game_time);
                setTime24s(response.timer_24s);
            } else if (!response.paused) {
                setStart("true");
                setPause(false);

                const updateTime = new Date(response.timestamp).getTime();
                const currentTime = new Date().getTime();
                const gameTime =
                    response.game_time -
                    Math.floor((currentTime - updateTime) / 100);
                const time24s =
                    response.timer_24s -
                    Math.floor((currentTime - updateTime) / 100);

                setTime(gameTime);
                setTime24s(time24s);

                timer24s.current.postMessage({
                    message: "START 24S",
                    interval: 100,
                });
                timer.current.postMessage({ message: "START", interval: 100 });

                setInstructions(
                    <p>
                        {lang
                            ? "Match ongoing! To pause the match, click "
                            : "Spēle turpinās! Lai apturētu spēli, spied "}
                        <i className="fa-solid fa-pause" />{" "}
                        {lang
                            ? "or press the space button."
                            : "vai atsarpes taustiņu. "}
                        <i className="fa-solid fa-circle-xmark" /> -{" "}
                        {lang ? "foul" : "piezīme"},{" "}
                        <i className="fa-solid fa-shield" /> -{" "}
                        {lang ? "block" : "bloks"},{" "}
                        <i className="fa-solid fa-hourglass-start" /> -{" "}
                        {lang ? "timeout" : "1 min pārtraukums"}.
                    </p>
                );
            }

            setGetUpdates(gameData.public_id);

            return;
        }
        const request = await fetch(
            "https://basketbols.onrender.com/api/games/new/public",
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
        setGetUpdates(response.id);
        setGameData((prev) => ({
            ...prev,
            public_id: response.id,
        }));
    };

    // ! SERVER UPDATES
    // Required for EventSource.onmessage functionality (who tf made this so weird?)
    const [updateData, setUpdateData] = React.useState(null);
    const updateRef = React.useRef(updateData);

    // Get updates from the server
    React.useEffect(() => {
        if (getUpdates === false) return;

        const eventStream = new EventSource(
            "https://basketbols.onrender.com/api/live/games/" + getUpdates
        );

        eventStream.onmessage = (e) => {
            setUpdateData(e.data);
        };

        eventStream.onerror = (e) => {
            console.log("[ERROR] Event stream error: " + e);
            eventStream.close();
        };

        return () => {
            eventStream.close();
        };
    }, [getUpdates]);

    // Update game data according to server updates
    React.useEffect(() => {
        updateRef.current = updateData;
        if (!updateData) return;
        const data = JSON.parse(updateData);

        // Pause handling
        if (data.paused !== pause) {
            setPause(!pause);
            if (!start) setStart("true");
            if (data.paused) {
                timer.current.postMessage({ message: "STOP" });
                timer24s.current.postMessage({ message: "STOP" });
                console.log(
                    `[PAUSE] Game paused at ${time} seconds remaining.`
                );

                setInstructions(
                    <p>
                        {lang
                            ? "Match paused! To continue the match, click"
                            : "Spēle apturēta! Lai turpinātu spēli, spied"}{" "}
                        <i className="fa-solid fa-play" />{" "}
                        {lang
                            ? "or press the space button."
                            : "vai atsarpes taustiņu."}
                    </p>
                );
            } else {
                if (time24s <= 0) {
                    setTime24s(240);
                    sendToServer(null, { time_24s: 240 });
                }

                timer.current.postMessage({
                    message: "START",
                    interval: 100,
                });

                timer24s.current.postMessage({
                    message: "START 24S",
                    interval: 100,
                });

                console.log(
                    `[RESUME] Game resumed at ${time} seconds remaining.`
                );

                setInstructions(
                    <p>
                        {lang
                            ? "Match ongoing! To pause the match, click "
                            : "Spēle turpinās! Lai apturētu spēli, spied "}
                        <i className="fa-solid fa-pause" />{" "}
                        {lang
                            ? "or press the space button."
                            : "vai atsarpes taustiņu. "}
                        <i className="fa-solid fa-circle-xmark" /> -{" "}
                        {lang ? "foul" : "piezīme"},{" "}
                        <i className="fa-solid fa-shield" /> -{" "}
                        {lang ? "block" : "bloks"},{" "}
                        <i className="fa-solid fa-hourglass-start" /> -{" "}
                        {lang ? "timeout" : "1 min pārtraukums"}.
                    </p>
                );
            }
        }

        // Quarters
        if (data.quarter !== quarter) setQuarter(data.quarter);

        // Timeouts
        if (data.team1_timeouts !== timeouts.team1) {
            setTimeoutTime(60);
            setTimeouts((prev) => ({
                ...prev,
                team1: data.team1_timeouts,
            }));
            timer.current.postMessage({
                message: "START TIMEOUT",
                interval: 1000,
            });
        }

        if (data.team2_timeouts !== timeouts.team2) {
            setTimeoutTime(60);
            setTimeouts((prev) => ({
                ...prev,
                team2: data.team2_timeouts,
            }));
            timer.current.postMessage({
                message: "START TIMEOUT",
                interval: 1000,
            });
        }

        // Time
        if (data.time_24s > time24s + 10 || data.time_24s < time24s - 10)
            setTime24s(data.time_24s);

        if (data.timeRemaining > time + 10 || data.timeRemaining < time - 10)
            setTime(data.timeRemaining);

        // Points
        if (data.team1Points !== gameData.team1points) {
            // Get animation ready
            document.getElementById("team1add").innerText = `+${
                data.team1Points - gameData.team1points
            }`;
            document.getElementById("team1points").classList.add("active");

            setTimeout(() => {
                document
                    .getElementById("team1points")
                    .classList.remove("active");
            }, 1500);

            // Add points to the team after 0.5s delay, to avoid showing before animation
            setTimeout(() => {
                setGameData((prev) => ({
                    ...prev,
                    team1points: data.team1Points,
                }));
            }, 500);
        }

        if (data.team2Points !== gameData.team2points) {
            // Get animation ready
            document.getElementById("team2add").innerText = `+${
                data.team2Points - gameData.team2points
            }`;
            document.getElementById("team2points").classList.add("active");

            setTimeout(() => {
                document
                    .getElementById("team2points")
                    .classList.remove("active");
            }, 1500);

            // Add points to the team after 0.5s delay, to avoid showing before animation
            setTimeout(() => {
                setGameData((prev) => ({
                    ...prev,
                    team2points: data.team2Points,
                }));
            }, 500);
        }

        // Fouls
        if (data.team1Fouls !== fouls.team1)
            setFouls((prev) => ({ ...prev, team1: data.team1Fouls }));
        if (data.team2Fouls !== fouls.team2)
            setFouls((prev) => ({ ...prev, team2: data.team2Fouls }));

        if (data.team1FoulDetails !== JSON.stringify(fouls.team1details))
            setFouls((prev) => ({
                ...prev,
                team1details: JSON.parse(data.team1FoulDetails),
            }));

        if (data.team2FoulDetails !== JSON.stringify(fouls.team2details))
            setFouls((prev) => ({
                ...prev,
                team2details: JSON.parse(data.team2FoulDetails),
            }));
    }, [updateData]);

    // Bring it all together
    const final = async () => {
        const teamIDs = await getGame();
        if (!teamIDs) return;
        await getTeams(teamIDs[0], 1);
        await getTeams(teamIDs[1], 2);
        setDisabled(false);
    };

    // ! TIMER, RESIZE, LOGIN
    // Check if user has access token & init web workers
    React.useEffect(() => {
        if (!localStorage.getItem("access_token")) {
            navigate("/login");
        }
        final();

        timer.current = new Worker(new URL("./timer.js", import.meta.url));
        timer24s.current = new Worker(new URL("./timer.js", import.meta.url));

        return () => {
            timer.current.terminate();
            timer24s.current.terminate();
        };
    }, []);

    // Set up web worker message listener
    React.useEffect(() => {
        const handler = (e) => {
            if (e.data === "TICK") {
                setTime((prev) => prev - 1);
            } else if (e.data === "TICK TIMEOUT") {
                setTimeoutTime((prev) => prev - 1);
            } else if (e.data === "TICK 24S") {
                setTime24s((prev) => prev - 1);
            }
        };

        timer.current.addEventListener("message", (e) => handler(e));
        timer24s.current.addEventListener("message", (e) => handler(e));

        return () => {
            timer.current.removeEventListener("message", (e) => handler(e));
            timer24s.current.removeEventListener("message", (e) => handler(e));
        };
    }, []);

    // Set up window resize listener
    React.useEffect(() => {
        const handler = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth < 715) {
                console.log("[ERROR] Screen too small");
                document.getElementsByClassName(
                    "gameFlex__container"
                )[0].style = "display: none;";
            } else {
                document.getElementsByClassName(
                    "gameFlex__container"
                )[0].style = "display: flex;";
            }
        };

        window.addEventListener("resize", handler);

        // Run on load
        if (window.innerWidth < 715) {
            console.log("[ERROR] Screen too small");
            document.getElementsByClassName("gameFlex__container")[0].style =
                "display: none;";
        }

        return () => {
            window.removeEventListener("resize", handler);
        };
    }, []);

    // Every time timeout time changes, update the instructions
    React.useEffect(() => {
        if (timeoutTime === 0) {
            timer.current.postMessage("STOP");
            setInstructions(
                <p>
                    {lang
                        ? "Match paused! To continue the match, click"
                        : "Spēle apturēta! Lai turpinātu spēli, spied"}{" "}
                    <i className="fa-solid fa-play" />{" "}
                    {lang
                        ? "or press the space button."
                        : "vai atsarpes taustiņu."}
                </p>
            );
            return;
        }

        if (timeoutTime < 11) {
            setInstructions(
                <p>
                    <i className="fa-solid fa-triangle-exclamation" /> <br />
                    {lang ? "Timeout (1 min):" : "Minūtes pārtraukums:"}{" "}
                    {timeoutTime} {lang ? "seconds" : "sekundes"}
                </p>
            );
        } else if (timeoutTime < 60) {
            setInstructions(
                <p>
                    {lang ? "Timeout (1 min):" : "Minūtes pārtraukums:"}{" "}
                    {timeoutTime} {lang ? "seconds" : "sekundes"}
                </p>
            );
        }
    }, [timeoutTime]);

    // Check if teams have been loaded and create public game
    React.useEffect(() => {
        if (
            gameData.id &&
            team1.name !== "Lādējas..." &&
            team2.name !== "Lādējas..." &&
            team1.name !== "Loading..." &&
            team2.name !== "Loading..."
        ) {
            createPublicGame();
        }
    }, [team1, team2]);

    // ! GET & SEND DATA
    // Function to show input modal and get value (async)
    const showModal = async () => {
        window.addEventListener("contextmenu", (e) => e.preventDefault());
        const modal = document.getElementById("playerOverlay");
        const submit = document.querySelector(".submitNr");
        const input = document.getElementById("playerNr");

        modal.style.display = "flex";
        setTimeout(() => {
            input.focus();
        }, 0);

        await new Promise((resolve) => {
            const listener = (e) => {
                if (e.key && e.key !== "Enter") return;
                submit.removeEventListener("click", listener);
                input.removeEventListener("keyup", listener);
                modal.style.display = "none";
                resolve(input.value);
            };

            submit.addEventListener("click", listener);
            input.addEventListener("keyup", listener);
        });
        const value = input.value;
        input.value = "";
        window.removeEventListener("contextmenu", (e) => e.preventDefault());
        return value;
    };

    // Function that handles sending data to the server
    const sendToServer = async (statData, liveData) => {
        if (!statData && !liveData) return false;
        const id = gameData.public_id;
        const statID = gameData.id;

        if (statData) {
            const request = await fetch(
                `https://basketbols.onrender.com/api/games/update/${statID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                    body: JSON.stringify(statData),
                }
            );
            if (request.status !== 204) {
                console.log(
                    `[ERROR] Failed to update game ${id} (stat id) on server. (statistics db)`
                );
                return false;
            }
        }

        if (liveData) {
            const request = await fetch(
                `https://basketbols.onrender.com/api/live/games/update/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                    body: JSON.stringify({
                        team1Points: liveData.team1Points
                            ? liveData.team1Points
                            : gameData.team1points,

                        team2Points: liveData.team2Points
                            ? liveData.team2Points
                            : gameData.team2points,

                        timeRemaining: liveData.timeRemaining
                            ? liveData.timeRemaining
                            : time,

                        quarter: liveData.quarter ? liveData.quarter : quarter,

                        team1Fouls: liveData.team1Fouls
                            ? liveData.team1Fouls
                            : fouls.team1,

                        team2Fouls: liveData.team2Fouls
                            ? liveData.team2Fouls
                            : fouls.team2,

                        team1FoulDetails: liveData.team1FoulDetails
                            ? JSON.stringify(liveData.team1FoulDetails)
                            : JSON.stringify(fouls.team1details),

                        team2FoulDetails: liveData.team2FoulDetails
                            ? JSON.stringify(liveData.team2FoulDetails)
                            : JSON.stringify(fouls.team2details),

                        timestamp: new Date(),

                        paused:
                            liveData.paused !== undefined
                                ? liveData.paused
                                : pause,

                        team1_timeouts: liveData.team1_timeouts
                            ? liveData.team1_timeouts
                            : timeouts.team1,

                        team2_timeouts: liveData.team2_timeouts
                            ? liveData.team2_timeouts
                            : timeouts.team2,
                        time_24s: liveData.time_24s
                            ? liveData.time_24s
                            : time24s,
                        start: liveData.start ? liveData.start : start,
                    }),
                }
            );
            if (request.status !== 204) {
                console.log(
                    `[ERROR] Failed to update live game ${id} on server. (live db)`
                );
                return false;
            }
        }
    };

    // ! FUNCTIONALITY

    // Play/pause game
    const pauseHandler = () => {
        if (disabled === true) return;

        // If game has not started, start it
        if (start === false && time >= 6000) {
            setStart(true);
            console.log(`[START] Game starting in 11 seconds.`);

            setInstructions(
                <p>
                    {lang
                        ? "Match ongoing! To pause the match, click "
                        : "Spēle turpinās! Lai apturētu spēli, spied "}
                    <i className="fa-solid fa-pause" />{" "}
                    {lang
                        ? "or press the space button."
                        : "vai atsarpes taustiņu. "}
                    <i className="fa-solid fa-circle-xmark" /> -{" "}
                    {lang ? "foul" : "piezīme"},{" "}
                    <i className="fa-solid fa-shield" /> -{" "}
                    {lang ? "block" : "bloks"},{" "}
                    <i className="fa-solid fa-hourglass-start" /> -{" "}
                    {lang ? "timeout" : "1 min pārtraukums"}.
                </p>
            );

            sendToServer(null, { start: true });

            setTimeout(() => {
                setPause(false);
                sendToServer(null, { paused: false });
                timer.current.postMessage({ message: "START", interval: 100 });

                console.log(
                    `[START] Game started at ${Date.now()} seconds since unix epoch.`
                );
                timer24s.current.postMessage({
                    message: "START 24S",
                    interval: 100,
                });
            }, 11000);

            return;
        }

        // If game is playing, pause it
        if (!pause) {
            setPause(true);
            sendToServer(null, { paused: true });
            timer.current.postMessage({ message: "STOP" });
            timer24s.current.postMessage({ message: "STOP" });
            console.log(`[PAUSE] Game paused at ${time} seconds remaining.`);

            setInstructions(
                <p>
                    {lang
                        ? "Match paused! To continue the match, click"
                        : "Spēle apturēta! Lai turpinātu spēli, spied"}{" "}
                    <i className="fa-solid fa-play" />{" "}
                    {lang
                        ? "or press the space button."
                        : "vai atsarpes taustiņu."}
                </p>
            );

            return;
        }

        // If game is paused, resume it
        if (pause) {
            setPause(false);
            if (time24s <= 0) {
                setTime24s(240);
                sendToServer(null, { paused: false, time_24s: 240 });
            } else {
                sendToServer(null, { paused: false });
            }

            timer.current.postMessage({
                message: "START",
                interval: 100,
            });

            timer24s.current.postMessage({
                message: "START 24S",
                interval: 100,
            });

            console.log(`[RESUME] Game resumed at ${time} seconds remaining.`);

            setInstructions(
                <p>
                    {lang
                        ? "Match ongoing! To pause the match, click "
                        : "Spēle turpinās! Lai apturētu spēli, spied "}
                    <i className="fa-solid fa-pause" />{" "}
                    {lang
                        ? "or press the space button."
                        : "vai atsarpes taustiņu. "}
                    <i className="fa-solid fa-circle-xmark" /> -{" "}
                    {lang ? "foul" : "piezīme"},{" "}
                    <i className="fa-solid fa-shield" /> -{" "}
                    {lang ? "block" : "bloks"},{" "}
                    <i className="fa-solid fa-hourglass-start" /> -{" "}
                    {lang ? "timeout" : "1 min pārtraukums"}.
                </p>
            );

            return;
        }
    };

    // Add points to the team
    const addPoints = async (team, points) => {
        if (disabled) return;
        if (pause) return;

        pauseHandler();

        const game = gameData;
        const modal = await showModal();

        if (!modal || modal == "") return;

        game.team1bestplayers = JSON.parse(game.team1bestplayers);
        game.team2bestplayers = JSON.parse(game.team2bestplayers);

        if (team === 1) {
            // Points by 1, 2 or 3
            if (points === 2) {
                game.team12points += 1;
                game.team1bestplayers.points2 += modal + ";";
            } else if (points === 3) {
                game.team13points += 1;
                game.team1bestplayers.points3 += modal + ";";
            } else {
                game.team1bestplayers.points1 += modal + ";";
            }

            // Lost points (points other team scored, for team statistics)
            game.team1lostpoints += 1;

            // Check if game is tied or lead has changed
            if (game.team1points + points === game.team2points) {
                game.timestied += 1;
            }

            // Check if lead has changed
            if (
                game.team1points + points > game.team2points &&
                game.team1points <= game.team2points
            ) {
                game.timesleadchanged += 1;
            }

            // Check if team has biggest lead now
            if (
                game.team1points + points - game.team2points >
                game.team1biggestlead
            ) {
                game.team1biggestlead =
                    game.team1points + points - game.team2points;
            }

            // Check if team has most points in a row
            if (statisticsData.previousTeam === 1) {
                statisticsData.team1.currentPointsInRow += points;
                if (
                    statisticsData.team1.currentPointsInRow >
                    statisticsData.team1.mostPointsInRow
                ) {
                    statisticsData.team1.mostPointsInRow =
                        statisticsData.team1.currentPointsInRow;
                    gameData.team1mostpointsinrow =
                        statisticsData.team1.mostPointsInRow;
                }
            } else {
                statisticsData.team1.currentPointsInRow = points;
            }
            statisticsData.previousTeam = 1;
        } else {
            if (points === 2) {
                game.team22points += 1;
                game.team2bestplayers.points2 += modal + ";";
            } else if (points === 3) {
                game.team23points += 1;
                game.team2bestplayers.points3 += modal + ";";
            } else {
                game.team2bestplayers.points1 += modal + ";";
            }

            game.team2lostpoints += 1;

            // Times tied
            if (game.team2points + points === game.team1points) {
                game.timestied += 1;
            }

            // Lead changes
            if (
                game.team2points + points > game.team1points &&
                game.team2points <= game.team1points
            ) {
                game.timesleadchanged += 1;
            }

            // Biggest lead
            if (
                game.team2points + points - game.team1points >
                game.team2biggestlead
            ) {
                game.team2biggestlead =
                    game.team2points + points - game.team1points;
            }

            // Most points in row
            if (statisticsData.previousTeam === 2) {
                statisticsData.team2.currentPointsInRow += points;
                if (
                    statisticsData.team2.currentPointsInRow >
                    statisticsData.team2.mostPointsInRow
                ) {
                    statisticsData.team2.mostPointsInRow =
                        statisticsData.team2.currentPointsInRow;
                    gameData.team2mostpointsinrow =
                        statisticsData.team2.mostPointsInRow;
                }
            } else {
                statisticsData.team2.currentPointsInRow = points;
            }
            statisticsData.previousTeam = 2;
        }

        game.team1bestplayers = JSON.stringify(game.team1bestplayers);
        game.team2bestplayers = JSON.stringify(game.team2bestplayers);

        setGameData(game);

        // Get animation ready
        document.getElementById("team" + team + "add").innerText = `+${points}`;
        document
            .getElementById("team" + team + "points")
            .classList.add("active");

        setTimeout(() => {
            document
                .getElementById("team" + team + "points")
                .classList.remove("active");
        }, 1500);

        // Add points to the team after 0.5s delay, to avoid showing before animation
        setTimeout(() => {
            if (team === 1) {
                sendToServer(null, {
                    team1Points: gameData.team1points + points,
                });
                setGameData((prev) => ({
                    ...prev,
                    team1points: prev.team1points + points,
                }));
            } else {
                sendToServer(null, {
                    team2Points: gameData.team2points + points,
                });
                setGameData((prev) => ({
                    ...prev,
                    team2points: prev.team2points + points,
                }));
            }
        }, 500);
    };

    // Add or remove fouls from the team
    const addRemoveFoul = async (e, team) => {
        if (disabled) return;
        if (!pause) pauseHandler();
        setDisabled(true);
        const value = await showModal();
        if (!value) {
            setDisabled(false);
            return;
        }

        // Left click (default) adds a foul
        if (e.button == 0) {
            console.log(
                "[INFO] Adding foul to team " +
                    team +
                    " (" +
                    (parseInt(fouls["team" + team]) + 1) +
                    " fouls total)"
            );

            setFouls((prev) => ({
                ...prev,
                ["team" + team]: parseInt(prev["team" + team]) + 1,
                ["team" + team + "details"]: [
                    ...prev["team" + team + "details"],
                    value,
                ],
            }));

            // Right click removes a foul
        } else if (e.button == 2) {
            if (fouls["team" + team] > 0) {
                console.log(
                    "[INFO] Removing foul from team " +
                        team +
                        " (" +
                        (parseInt(fouls["team" + team]) - 1) +
                        " fouls total)"
                );
                const index = fouls["team" + team + "details"].indexOf(value);
                if (index == -1) {
                    setDisabled(false);
                    return;
                }
                setFouls((prev) => ({
                    ...prev,
                    ["team" + team]: parseInt(prev["team" + team]) - 1,
                    ["team" + team + "details"]: prev[
                        "team" + team + "details"
                    ].splice(index, 1),
                }));
            }
        }
        setDisabled(false);
    };

    // Send new fouls to server
    React.useEffect(() => {
        if (gameData.id) {
            sendToServer(null, {
                team1Fouls: fouls.team1,
                team2Fouls: fouls.team2,
                team1FoulDetails: fouls.team1details,
                team2FoulDetails: fouls.team2details,
            });
        }
    }, [fouls]);

    // Add or remove block
    const addRemoveBlock = async (e, team) => {
        if (disabled) return;

        // Left click (default) adds a block
        if (e.button == 0) {
            console.log("[INFO] Adding block to team " + team);

            setGameData((prev) => ({
                ...prev,
                ["team" + team + "blocks"]: prev["team" + team + "blocks"] + 1,
            }));
        } else if (e.button == 2) {
            if (gameData["team" + team + "blocks"] > 0) {
                console.log("[INFO] Removing block from team " + team);

                setGameData((prev) => ({
                    ...prev,
                    ["team" + team + "blocks"]:
                        prev["team" + team + "blocks"] - 1,
                }));
            } else {
                console.log("[WARNING] Team has no blocks to remove.");
            }
        } else {
            console.log("[ERROR] Unknown mouse button clicked.");
        }
        document.getElementById("team" + team + "block").style =
            "color: #90ee98; border: 1px solid #90ee98; cursor: pointer; transition: 0.2s;";
        setTimeout(
            () =>
                (document.getElementById("team" + team + "block").style =
                    "cursor: pointer;"),
            500
        );
    };

    // Add or remove timeout
    const addMinuteBreak = (e, team) => {
        if (disabled) return;
        if (!pause) pauseHandler();
        setTimeoutTime(60);

        console.log("[INFO] Adding 1 minute break to team " + team);

        if (team === 1) {
            if (timeouts.team1 < 6) {
                sendToServer(null, {
                    team1_timeouts: timeouts.team1 + 1,
                });
                setTimeouts((prev) => ({
                    ...prev,
                    team1: prev.team1 + 1,
                }));
            } else {
                console.log("[WARN] Team 1 has no more timeouts left.");
                return;
            }
        } else if (team === 2) {
            if (timeouts.team2 < 6) {
                sendToServer(null, {
                    team2_timeouts: timeouts.team2 + 1,
                });
                setTimeouts((prev) => ({
                    ...prev,
                    team2: prev.team2 + 1,
                }));
            } else {
                console.log("[WARN] Team 2 has no more timeouts left.");
                return;
            }
        }

        timer.current.postMessage({ message: "START TIMEOUT", interval: 1000 });
    };

    // Handle 24s timer
    const handle24s = (seconds) => {
        if (disabled) return;
        sendToServer(null, { time_24s: seconds * 10 });
        setTime24s(seconds * 10);
        if (pause) return;
        timer24s.current.postMessage({ message: "START 24S", interval: 100 });
    };

    // Check if 24s timer has ended
    React.useEffect(() => {
        if (time24s <= 0) {
            timer24s.current.postMessage("STOP");
            console.log("[INFO] 24s timer has ended.");
            setTime24s(0);
            if (!pause) pauseHandler();
        }
    }, [time24s]);

    // Keyboard shortcuts
    const keyDown = (e) => {
        const event = new MouseEvent("mousedown", {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 0,
        });

        if (e.key.toUpperCase() === " ") {
            playButton.current.click();
        } else if (e.code === "Digit1") {
            document.getElementById("team1one").dispatchEvent(event);
        } else if (e.code === "Digit2") {
            document.getElementById("team1two").dispatchEvent(event);
        } else if (e.code === "Digit3") {
            document.getElementById("team1three").dispatchEvent(event);
        } else if (e.code === "Numpad1") {
            document.getElementById("team2one").dispatchEvent(event);
        } else if (e.code === "Numpad2") {
            document.getElementById("team2two").dispatchEvent(event);
        } else if (e.code === "Numpad3") {
            document.getElementById("team2three").dispatchEvent(event);
        } else if (e.code === "KeyQ") {
            document.getElementById("team1foul").dispatchEvent(event);
        } else if (e.code === "KeyW") {
            document.getElementById("team1block").dispatchEvent(event);
        } else if (e.code === "KeyE") {
            document.getElementById("team1timeout").dispatchEvent(event);
        } else if (e.code === "KeyI") {
            document.getElementById("team2foul").dispatchEvent(event);
        } else if (e.code === "KeyO") {
            document.getElementById("team2block").dispatchEvent(event);
        } else if (e.code === "KeyP") {
            document.getElementById("team2timeout").dispatchEvent(event);
        }
    };

    // Add event listener to window for keydown event (for shortcuts)
    React.useEffect(() => {
        document.body.addEventListener("keyup", keyDown);
        if (!window.Worker) {
            setInstructions(
                <p>
                    {lang
                        ? "Your browser does not support Web Workers. Please change or update your browser."
                        : "Jūsu pārlūkprogramma neatbalsta Web Workers. Lūdzu nomainiet vai atjauniniet savu pārlūkprogrammu."}
                </p>
            );
        }
        return () => {
            document.body.removeEventListener("keyup", keyDown);
        };
    }, []);

    // Check if quarter has ended and set the next one up
    React.useEffect(() => {
        if (time === 0) {
            timer.current.postMessage("STOP");
            setDisabled(true);
            setPause(true);
            setTime(0);
            sendToServer(null, { paused: true, timeRemaining: 0 });
            console.log(`[END] End of quarter ${quarter}.`);
            if (quarter !== 4) {
                setTimeout(() => {
                    setTime(6000);
                    setQuarter((prev) => prev + 1);
                    setFouls((prev) => ({
                        ...prev,
                        team1: 0,
                        team2: 0,
                    }));
                    setTime24s(240);
                    setDisabled(false);
                }, 5000);
            }

            // Set break times
            if (quarter === 1 || quarter === 3) {
                setInstructions(
                    <p>
                        {lang
                            ? "Break before " +
                              (quarter === 1 ? "2nd" : "4th") +
                              " quarter. Game needs to be continued in 2 min."
                            : "Pārtraukums pirms " +
                              (quarter + 1) +
                              ". ceturtdaļas. Spēle jāturpina pēc 2 min."}{" "}
                        (
                        {new Date(
                            Date.now() + 60 * 1000 * 2
                        ).toLocaleTimeString("en-GB")}
                        )
                    </p>
                );
            } else if (quarter === 2) {
                setInstructions(
                    <p>
                        {lang
                            ? "Halftime. Match needs to be continued in 15 min."
                            : "Puslaiks. Spēle jāturpina pēc 15min."}{" "}
                        (
                        {new Date(
                            Date.now() + 60 * 1000 * 15
                        ).toLocaleTimeString("en-GB")}
                        )
                    </p>
                );
            } else {
                setInstructions(
                    <p>
                        {lang
                            ? "Match has ended. To navigate to the game analysis, click"
                            : "Spēle beigusies. Lai aizietu uz spēles analīzi, spied"}{" "}
                        <i className="fa-solid fa-arrow-right" />{" "}
                        {lang
                            ? "or press the space button."
                            : "vai atsarpes taustiņu."}
                    </p>
                );
                document.getElementById("gameSpaceBtn").onclick = () => {
                    navigate(`/app/game/${gameData.id}/analysis`);
                };
                document.getElementById("gameSpaceBtn").style =
                    "color: var(--keyboardBtn_color); border: 1px solid var(--keyboardBtn_color); cursor: pointer;";
            }
        }

        if (time <= time24s) {
            timer24s.current.postMessage("STOP");
            setTime24s(240);
        }
    }, [time]);

    // On every gameData change, send it to the stat server
    React.useEffect(() => {
        if (gameData.id) {
            const values = {
                team1points: gameData.team1points,
                team2points: gameData.team2points,
                team1Blocks: gameData.team1blocks,
                team13points: gameData.team13points,
                // Cik x iemests pretinieka grozā
                team1LostPoints: gameData.team1lostpoints,
                team12points: gameData.team12points,
                team2Blocks: gameData.team2blocks,
                team23points: gameData.team23points,
                team2LostPoints: gameData.team2lostpoints,
                team22points: gameData.team22points,
                timesTied: gameData.timestied,
                timesLeadChanged: gameData.timesleadchanged,
                team2BiggestLead: gameData.team2biggestlead,
                team1BiggestLead: gameData.team1biggestlead,
                team1MostPointsInRow: gameData.team1mostpointsinrow,
                team2MostPointsInRow: gameData.team2mostpointsinrow,
                team1BestPlayers: gameData.team1bestplayers,
                team2BestPlayers: gameData.team2bestplayers,
                id: gameData.id,
            };
            sendToServer(values, null);
        }
    }, [gameData]);

    // Show foul modal
    const showFoulModal = (team) => {
        if (disabled) return;
        if (!pause) pauseHandler();

        const modal = document.getElementById("foulOverlay");
        const detailsArray = team ? fouls.team1details : fouls.team2details;
        const tableArray = [];

        for (let i = 0; i < detailsArray.length; i++) {
            // check if value is in tableArray
            let includes = false;
            for (let j = 0; j < tableArray.length; j++) {
                if (tableArray[j][0] === detailsArray[i]) {
                    includes = j;
                    break;
                }
            }
            if (includes !== false) {
                tableArray[includes][1] += 1;
            } else {
                // if it isn't, add it to the tableArray
                tableArray.push([detailsArray[i], 1]);
            }
        }

        setFoulModalContent(
            <div className="foulOverlay">
                <i
                    className="fa-solid fa-close"
                    onClick={(e) =>
                        (e.target.parentNode.parentNode.style.display = "none")
                    }
                />
                <h2>
                    {team ? team1.name : team2.name}{" "}
                    {lang ? "fouls" : "piezīmes"}
                </h2>
                <h4>
                    {lang ? "In total: " : "Kopā: "}
                    {team
                        ? fouls.team1details.length
                        : fouls.team2details.length}
                </h4>
                <table>
                    <tbody>
                        {tableArray.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item[0]}</td>
                                    <td>
                                        {item[1] > 4
                                            ? [...Array(item[0])].map(
                                                  (e, i) => (
                                                      <span className="circle red" />
                                                  )
                                              )
                                            : [...Array(item[1])].map(
                                                  (e, i) => (
                                                      <span className="circle" />
                                                  )
                                              )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
        modal.style = "display: flex;";
    };

    // Render
    return (
        <div className="game__container">
            <StartAnimation start={start} />

            <i className="fa-solid fa-globe changeLang" onClick={changeLanguage}/>
            <div className="gameFlex__container">
                <div className="flexCont team">
                    <h2>{team1.name}</h2>
                    <div className="points__cont">
                        <h1 id="team1points">
                            {gameData.team1points} <br />
                            <div id="team1add" />
                        </h1>
                    </div>
                    <div className="btnCont">
                        <KeyboardBtn
                            pointer
                            text="+1"
                            onClick={() => addPoints(1, 1)}
                            id="team1one"
                        />
                        <KeyboardBtn
                            pointer
                            text="+2"
                            onClick={() => addPoints(1, 2)}
                            id="team1two"
                        />
                        <KeyboardBtn
                            pointer
                            text="+3"
                            onClick={() => addPoints(1, 3)}
                            id="team1three"
                        />
                    </div>
                    <div
                        className={
                            fouls.team1 >= 4
                                ? "foul__container full"
                                : "foul__container"
                        }
                        onClick={() => showFoulModal(1)}
                    >
                        <span
                            className={
                                fouls.team1 >= 1 ? "foul active" : "foul"
                            }
                        />
                        <span
                            className={
                                fouls.team1 >= 2 ? "foul active" : "foul"
                            }
                        />
                        <span
                            className={
                                fouls.team1 >= 3 ? "foul active" : "foul"
                            }
                        />
                        <span
                            className={
                                fouls.team1 >= 4 ? "foul active" : "foul"
                            }
                        />
                        <span
                            className={
                                fouls.team1 >= 5 ? "foul active" : "foul"
                            }
                        />
                    </div>
                    <div className="btnCont">
                        <KeyboardBtn
                            pointer
                            text={<i className="fa-solid fa-circle-xmark" />}
                            onClick={(e) => addRemoveFoul(e, 1)}
                            id="team1foul"
                        />
                        <KeyboardBtn
                            pointer
                            text={<i className="fa-solid fa-shield" />}
                            onClick={(e) => addRemoveBlock(e, 1)}
                            id="team1block"
                        />
                        <KeyboardBtn
                            pointer
                            text={<i className="fa-solid fa-hourglass-start" />}
                            onClick={
                                timeouts.team1 > 6
                                    ? () => {}
                                    : (e) => addMinuteBreak(e, 1)
                            }
                            gray={timeouts.team1 >= 6 ? true : false}
                            id="team1timeout"
                        />
                    </div>
                </div>

                <div className="flexCont" id="adminGameInstructions">
                    <div className="timeBtn__cont">
                        <KeyboardBtn
                            pointer
                            text="24"
                            id="24s_button"
                            onClick={() => handle24s(24)}
                        />
                        <KeyboardBtn
                            pointer
                            text="14"
                            id="14s_button"
                            onClick={() => handle24s(14)}
                        />
                    </div>
                    <span
                        className={
                            disabled
                                ? "spaceBtn keyboardBtn disabled"
                                : "spaceBtn keyboardBtn"
                        }
                        id="gameSpaceBtn"
                        onClick={pauseHandler}
                        ref={playButton}
                    >
                        <i
                            className={
                                pause
                                    ? quarter === 4 && time === 0
                                        ? "fa-solid fa-arrow-right fa-xl"
                                        : "fa-solid fa-play fa-xl"
                                    : "fa-solid fa-pause fa-xl"
                            }
                        />
                    </span>
                    {instructions}
                </div>

                <div className="flexCont team team-right">
                    <h2>{team2.name}</h2>
                    <div className="points__cont">
                        <h1 id="team2points">
                            {gameData.team2points} <br />
                            <div id="team2add">+3</div>
                        </h1>
                    </div>
                    <div className="btnCont">
                        <KeyboardBtn
                            pointer
                            text="+1"
                            onClick={() => addPoints(2, 1)}
                            id="team2one"
                        />
                        <KeyboardBtn
                            pointer
                            text="+2"
                            onClick={() => addPoints(2, 2)}
                            id="team2two"
                        />
                        <KeyboardBtn
                            pointer
                            text="+3"
                            onClick={() => addPoints(2, 3)}
                            id="team2three"
                        />
                    </div>
                    <div
                        className={
                            fouls.team2 >= 4
                                ? "foul__container full"
                                : "foul__container"
                        }
                        onClick={() => showFoulModal(0)}
                    >
                        <span
                            className={
                                fouls.team2 >= 1 ? "foul active" : "foul"
                            }
                        />
                        <span
                            className={
                                fouls.team2 >= 2 ? "foul active" : "foul"
                            }
                        />
                        <span
                            className={
                                fouls.team2 >= 3 ? "foul active" : "foul"
                            }
                        />
                        <span
                            className={
                                fouls.team2 >= 4 ? "foul active" : "foul"
                            }
                        />
                        <span
                            className={
                                fouls.team2 >= 5 ? "foul active" : "foul"
                            }
                        />
                    </div>
                    <div className="btnCont">
                        <KeyboardBtn
                            pointer
                            text={<i className="fa-solid fa-circle-xmark" />}
                            onClick={(e) => addRemoveFoul(e, 2)}
                            id="team2foul"
                        />
                        <KeyboardBtn
                            pointer
                            text={<i className="fa-solid fa-shield" />}
                            onClick={(e) => addRemoveBlock(e, 2)}
                            id="team2block"
                        />
                        <KeyboardBtn
                            pointer
                            text={<i className="fa-solid fa-hourglass-start" />}
                            onClick={
                                timeouts.team2 > 6
                                    ? () => {}
                                    : (e) => addMinuteBreak(e, 2)
                            }
                            gray={timeouts.team2 >= 6 ? true : false}
                            id="team2timeout"
                        />
                    </div>
                </div>
            </div>
            <div className="gameInfo">
                <h5
                    style={
                        time24s > 50
                            ? { margin: "0" }
                            : { margin: "0", color: "red" }
                    }
                >
                    {time24s > 100
                        ? Math.floor(time24s / 10)
                        : !Number.isInteger((time24s % 240) / 10)
                        ? time24s / 10
                        : time24s / 10 + ".0"}
                </h5>
                <h3>
                    {time % 600 > 99
                        ? // If deciseconds are more than 99 (more than 10s, no matter about minutes)
                          time > 599
                            ? // If time is more than 1 min
                              (time - (time % 600)) / 600 +
                              ":" +
                              Math.floor((time % 600) / 10)
                            : // If time is less than 1 min
                            // If deciseconds / 10 is not an int (don't end in 0)
                            !Number.isInteger((time % 600) / 10)
                            ? "0:" + (time % 600) / 10
                            : "0:" + (time % 600) / 10 + ".0"
                        : // If deciseconds are less than 100 (less than 10s)
                        time > 599
                        ? // If time is more than 1 min
                          (time - (time % 600)) / 600 +
                          ":0" +
                          Math.floor((time % 600) / 10)
                        : // If time is less than 1 min
                        // If deciseconds / 10 is not an int (don't end in 0)
                        !Number.isInteger((time % 600) / 10)
                        ? "0:0" + (time % 600) / 10
                        : "0:0" + (time % 600) / 10 + ".0"}
                </h3>
                <h4>
                    <b>
                        {lang ? "Period" : "Periods"} {quarter}
                    </b>
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
                    {lang ? "group" : "grupa"}
                </p>
                <p>
                    {gameData.venue
                        ? gameData.venue
                        : lang
                        ? "Main arena of tournament"
                        : "Turnīra galvenā arēna"}
                </p>
            </div>

            <div className="playerOverlay__cont" id="playerOverlay">
                <div className="playerOverlay">
                    <input
                        type="number"
                        name="playerNr"
                        id="playerNr"
                        placeholder="Nr."
                        autoFocus
                        min={0}
                    />
                    <button className="submitNr">OK &rarr;</button>
                </div>
            </div>

            <div className="foulOverlay__cont" id="foulOverlay">
                {foulModalContent}
            </div>
            <div
                className="smallScreenOverlay"
                style={
                    windowWidth < 715
                        ? { display: "flex" }
                        : { display: "none" }
                }
            >
                <h1>
                    {lang
                        ? "We're sorry, you can't count game stats on a screen this size"
                        : "Atvainojamies, uz šī ekrāna nevar skaitīt spēles statistiku"}
                </h1>
                <p>
                    {lang ? "Try:" : "Pamēģiniet:"}
                    <ul>
                        <li>
                            {lang
                                ? "Turning the device horizontally"
                                : "Pagriezt ierīci horizontāli"}
                        </li>
                        <li>
                            {lang
                                ? "Using a different device/screen"
                                : "Izmantot citu ierīci/ekrānu"}
                        </li>
                    </ul>
                </p>
                <p>
                    {lang
                        ? "Screens narrower than 715px are not supported. (this one is " +
                          windowWidth +
                          "px)"
                        : "Ekrāni šaurāki par 715px netiek atbalstīti. (jums " +
                          windowWidth +
                          "px)"}
                </p>
            </div>
        </div>
    );
}
