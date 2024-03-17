// TODO: responsive design, server-sent events for data sending
// TODO: add modal for foul viewing (per player), use WebWorkers for timeout timer
// ! No need to follow design exactly -- that is for public page. This is for admin page.
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

  // Set states
  const [gameData, setGameData] = React.useState({
    team1points: 0,
    team2points: 0,
  });

  const [instructions, setInstructions] = React.useState(
    <p>Lūdzu, mazliet pagaidiet! Mēs lādējam spēles informāciju!</p>,
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
  const [time, setTime] = React.useState(6000); // 10 minutes in deciseconds
  const [timeoutTime, setTimeoutTime] = React.useState(60); // 1 minute in seconds
  const [quarter, setQuarter] = React.useState(1);
  const [timeInterval, setTimeInterval] = React.useState(null);

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

  // Set title
  document.title =
    team1.id && team2.id
      ? `Spēle | ${team1.name} vs ${team2.name} | Gandrīz NBA`
      : "Lādējam spēli | Gandrīz NBA";

  // Set refs
  const playButton = useRef();

  // Get game data from the server
  const getGame = async () => {
    const { id } = params;
    let request;
    try {
      request = await fetch(`http://localhost:8080/api/games/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
    } catch (error) {
      console.error("[CRITICAL] Failed to fetch game data from server.");
      console.log(error);
      setInstructions(
        <p>Ir notikusi kļūda. Atsvaidzini lapu vai sazinies ar atbalstu.</p>,
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
        Lai sāktu 10s laika atskaiti līdz spēles sākumam, spied{" "}
        <i className="fa-solid fa-play"></i> vai atsarpes taustiņu.
      </p>,
    );

    setGameData(response[0]);
    console.log(response[0]);
    return [response[0].team1id, response[0].team2id];
  };

  // Get teams data from the server
  const getTeams = async (teamID, num) => {
    const request = await fetch("http://localhost:8080/api/teams/" + teamID, {
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

    if (num == 1) {
      setTeam1(response);
    } else {
      setTeam2(response);
    }
  };

  // Create public game
  const createPublicGame = async () => {
    console.log("Creating public game");
    if (gameData.public_id) {
      console.log("[INFO] Public game data found");
      const request = await fetch(
        "http://localhost:8080/api/live/games/once/" + gameData.public_id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      let response = await request.json();
      response = response[0];
      console.log(response);

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

      if (response.paused && response.game_time < 6000) {
        setStart("true");
        setPause(true);
        setTime(response.game_time);
        setInstructions(
          <p>
            Spēle apturēta! Lai turpinātu spēli, spied{" "}
            <i className="fa-solid fa-play"></i> vai atsarpes taustiņu.
          </p>,
        );
      } else if (!response.paused) {
        setStart("true");
        if (pause) {
          setTimeInterval(
            setInterval(() => {
              setTime((prev) => prev - 1);
            }, 100),
          );
        }
        setPause(false);
        const updateTime = new Date(response.timestamp).getTime();
        const currentTime = new Date().getTime();
        const gameTime =
          response.game_time - Math.floor((currentTime - updateTime) / 100);
        console.log(gameTime);
        console.log(response.game_time);
        console.log((currentTime - updateTime) / 100);
        setTime(gameTime);
        setInstructions(
          <p>
            Spēle turpinās! Lai apturētu spēli, spied{" "}
            <i className="fa-solid fa-pause"></i> vai atsarpes taustiņu.{" "}
            <i className="fa-solid fa-circle-xmark"></i> - piezīme,{" "}
            <i className="fa-solid fa-shield"></i> - bloks,{" "}
            <i className="fa-solid fa-hourglass-start"></i> - 1min pārtraukums.
          </p>,
        );
      }

      return;
    }
    const request = await fetch("http://localhost:8080/api/games/new/public", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        gameid: gameData.id,
        team1name: team1.name,
        team2name: team2.name,
        timestamp: new Date().getTime(),
      }),
    });
    const response = await request.json();
    setGameData((prev) => ({
      ...prev,
      public_id: response.id,
    }));
  };

  // Bring it all together
  const final = async () => {
    const teamIDs = await getGame();
    if (!teamIDs) return;
    await getTeams(teamIDs[0], 1);
    await getTeams(teamIDs[1], 2);
    setDisabled(false);
  };

  // Check if user has access token
  React.useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
    }
    final();

    timer.current = new Worker(new URL("./timer.js", import.meta.url));
    return () => {
      timer.current.terminate();
    };
  }, []);

  // Set up web worker message listener
  React.useEffect(() => {
    const handler = (e) => {
      if (e.data === "TICK") {
        setTime((prev) => prev - 1);
      } else if (e.data === "TICK TIMEOUT") {
        setTimeoutTime((prev) => prev - 1);
      }
    };

    timer.current.addEventListener("message", (e) => handler(e));

    return () => {
      timer.current.removeEventListener("message", (e) => handler(e));
    };
  }, []);

  // Every time timeout time changes, update the instructions
  React.useEffect(() => {
    if (timeoutTime === 0) {
      timer.current.postMessage("STOP");
      setInstructions(
        <p>
          Spēle apturēta! Lai turpinātu spēli, spied{" "}
          <i className="fa-solid fa-play"></i> vai atsarpes taustiņu.
        </p>,
      );
      return;
    }

    if (timeoutTime < 11) {
      setInstructions(
        <p>
          <i className="fa-solid fa-triangle-exclamation"></i> <br />
          Minūtes pārtraukums: {timeoutTime} sekundes
        </p>,
      );
    } else if (timeoutTime < 60) {
      setInstructions(<p>Minūtes pārtraukums: {timeoutTime} sekundes</p>);
    }
  }, [timeoutTime]);

  // Check if teams have been loaded and create public game
  React.useEffect(() => {
    if (
      gameData.id &&
      team1.name !== "Lādējas..." &&
      team2.name !== "Lādējas..."
    ) {
      createPublicGame();
    }
  }, [team1, team2]);

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
        `http://localhost:8080/api/games/update/${statID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(statData),
        },
      );
      console.log(
        "[INFO] Update status from server (statistics db): " + request.status,
      );
      if (request.status !== 204) {
        console.log(
          `[ERROR] Failed to update game ${id} (stat id) on server. (statistics db)`,
        );
        return false;
      }
    }

    if (liveData) {
      const request = await fetch(
        `http://localhost:8080/api/live/games/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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

            team1Fouls: liveData.team1Fouls ? liveData.team1Fouls : fouls.team1,

            team2Fouls: liveData.team2Fouls ? liveData.team2Fouls : fouls.team2,

            team1FoulDetails: liveData.team1FoulDetails
              ? JSON.stringify(liveData.team1FoulDetails)
              : JSON.stringify(fouls.team1details),

            team2FoulDetails: liveData.team2FoulDetails
              ? JSON.stringify(liveData.team2FoulDetails)
              : JSON.stringify(fouls.team2details),

            timestamp: new Date(),

            paused: liveData.paused !== undefined ? liveData.paused : pause,

            team1_timeouts: liveData.team1_timeouts
              ? liveData.team1_timeouts
              : timeouts.team1,

            team2_timeouts: liveData.team2_timeouts
              ? liveData.team2_timeouts
              : timeouts.team2,
          }),
        },
      );
      console.log(
        "[INFO] Update status from server (live db): " + request.status,
      );
      if (request.status !== 204) {
        console.log(
          `[ERROR] Failed to update live game ${id} on server. (live db)`,
        );
        return false;
      }
    }
  };

  // ! FUNCTIONALITY

  // Play/pause game
  const pauseHandler = () => {
    if (disabled === true) {
      console.log(
        "[ERROR] Buttons are disabled. Cannot play/pause game. Probably loading data.",
      );
      return;
    }

    // If game has not started, start it
    if (!start) {
      setStart(true);
      console.log(`[START] Game starting in 11 seconds.`);

      setInstructions(
        <p>
          Spēle sākusies! Lai apturētu spēli, spied{" "}
          <i className="fa-solid fa-pause"></i> vai atsarpes taustiņu.{" "}
          <i className="fa-solid fa-circle-xmark"></i> - piezīme,{" "}
          <i className="fa-solid fa-shield"></i> - bloks,{" "}
          <i className="fa-solid fa-hourglass-start"></i> - 1min pārtraukums.
        </p>,
      );

      setTimeout(() => {
        setPause(false);
        sendToServer(null, { paused: false });
        timer.current.postMessage({ message: "START", interval: 100 });

        console.log(
          `[START] Game started at ${Date.now()} seconds since unix epoch.`,
        );
      }, 11000);

      return;
    }

    // If game is playing, pause it
    if (!pause) {
      setPause(true);
      sendToServer(null, { paused: true });
      timer.current.postMessage({ message: "STOP" });
      console.log(`[PAUSE] Game paused at ${time} seconds remaining.`);

      setInstructions(
        <p>
          Spēle apturēta! Lai turpinātu spēli, spied{" "}
          <i className="fa-solid fa-play"></i> vai atsarpes taustiņu.
        </p>,
      );

      return;
    }

    // If game is paused, resume it
    if (pause) {
      setPause(false);
      sendToServer(null, { paused: false });

      timer.current.postMessage({
        message: "START",
        interval: 100,
      });

      console.log(`[RESUME] Game resumed at ${time} seconds remaining.`);

      setInstructions(
        <p>
          Spēle turpinās! Lai apturētu spēli, spied{" "}
          <i className="fa-solid fa-pause"></i> vai atsarpes taustiņu.{" "}
          <i className="fa-solid fa-circle-xmark"></i> - piezīme,{" "}
          <i className="fa-solid fa-shield"></i> - bloks,{" "}
          <i className="fa-solid fa-hourglass-start"></i> - 1min pārtraukums.
        </p>,
      );

      return;
    }
  };

  // Add points to the team
  const addPoints = (team, points) => {
    if (disabled) return;
    if (pause) return;
    // setDisabled(true);

    // Get animation ready
    document.getElementById("team" + team + "add").innerText = `+${points}`;
    document.getElementById("team" + team + "points").classList.add("active");

    setTimeout(() => {
      document
        .getElementById("team" + team + "points")
        .classList.remove("active");
      // setDisabled(false);
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
          " at time " +
          Date.now() +
          " since unix epoch. (" +
          (parseInt(fouls["team" + team]) + 1) +
          " fouls total)",
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
          "Removing foul from team " +
            team +
            " at time " +
            Date.now() +
            "since unix epoch. (" +
            (parseInt(fouls["team" + team]) - 1) +
            " fouls total)",
        );
        const index = fouls["team" + team + "details"].indexOf(value);
        console.log(index);
        if (index == -1) {
          setDisabled(false);
          return;
        }
        setFouls((prev) => ({
          ...prev,
          ["team" + team]: parseInt(prev["team" + team]) - 1,
          ["team" + team + "details"]: prev["team" + team + "details"].splice(
            index,
            1,
          ),
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
      console.log(
        "[INFO] Adding block to team " +
          team +
          " at time " +
          Date.now() +
          "since unix epoch.",
      );

      console.log(gameData["team" + team + "blocks"]);

      setGameData((prev) => ({
        ...prev,
        ["team" + team + "blocks"]: prev["team" + team + "blocks"] + 1,
      }));
    } else if (e.button == 2) {
      if (gameData["team" + team + "blocks"] > 0) {
        console.log(
          "[INFO] Removing block from team " +
            team +
            " at time " +
            Date.now() +
            "since unix epoch.",
        );

        setGameData((prev) => ({
          ...prev,
          ["team" + team + "blocks"]: prev["team" + team + "blocks"] - 1,
        }));
      } else {
        console.log("[WARNING] Team has no blocks to remove.");
      }
    } else {
      console.log("Unknown mouse button clicked.");
    }
    document.getElementById("team" + team + "block").style =
      "color: #90ee98; border: 1px solid #90ee98; cursor: pointer; transition: 0.2s;";
    setTimeout(
      () =>
        (document.getElementById("team" + team + "block").style =
          "cursor: pointer;"),
      500,
    );
  };

  // Add or remove timeout
  const addMinuteBreak = (e, team) => {
    if (disabled) return;
    if (!pause) pauseHandler();
    setTimeoutTime(60);

    console.log(
      "[INFO] Adding 1 minute break to team " +
        team +
        " at time " +
        Date.now() +
        "since unix epoch.",
    );

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
          Jūsu pārlūkprogramma neatbalsta Web Workers. Lūdzu nomainiet vai
          atjauniniet savu pārlūkprogrammu.
        </p>,
      );
    }
    return () => {
      document.body.removeEventListener("keyup", keyDown);
    };
  }, []);

  // Check if quarter has ended and set the next one up
  React.useEffect(() => {
    if (time === 0) {
      clearInterval(timeInterval);
      setPause(true);
      setTimeout(() => {
        setTime(6000);
        setQuarter((prev) => prev + 1);
        setFouls((prev) => ({
          ...prev,
          team1: 0,
          team2: 0,
        }));
      }, 5000);
      console.log(`[END] End of quarter ${quarter}.`);

      // Set break times
      if (quarter === 1 || quarter === 3) {
        setInstructions(
          <p>
            Pārtraukums pirms 2. ceturtdaļas. Spēle jāturpina pēc 2 min. (
            {new Date(Date.now() + 60 * 1000 * 2).toLocaleTimeString("en-GB")})
          </p>,
        );
      } else if (quarter === 2) {
        setInstructions(
          <p>
            Pārtraukums pirms 3. ceturtdaļas. Spēle jāturpina pēc 15 min. (
            {new Date(Date.now() + 60 * 1000 * 15).toLocaleTimeString("en-GB")})
          </p>,
        );
      } else {
        setInstructions(
          <p>
            Spēle beigusies. Lai aizietu uz spēles analīzi, spied{" "}
            <i className="fa-solid fa-arrow-right"></i> vai atsarpes taustiņu.
          </p>,
        );
      }
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
      console.log(values);
      sendToServer(values, null);
    }
  }, [gameData]);

  return (
    <div className="game__container">
      <StartAnimation start={start} />

      <div className="gameFlex__container">
        <div className="flexCont team">
          <h2>{team1.name}</h2>
          <div className="points__cont">
            <h1 id="team1points">
              {gameData.team1points} <br />
              <div id="team1add"></div>
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
              fouls.team1 >= 4 ? "foul__container full" : "foul__container"
            }
          >
            <span className={fouls.team1 >= 1 ? "foul active" : "foul"}></span>
            <span className={fouls.team1 >= 2 ? "foul active" : "foul"}></span>
            <span className={fouls.team1 >= 3 ? "foul active" : "foul"}></span>
            <span className={fouls.team1 >= 4 ? "foul active" : "foul"}></span>
            <span className={fouls.team1 >= 5 ? "foul active" : "foul"}></span>
          </div>
          <div className="btnCont">
            <KeyboardBtn
              pointer
              text={<i className="fa-solid fa-circle-xmark"></i>}
              onClick={(e) => addRemoveFoul(e, 1)}
              id="team1foul"
            />
            <KeyboardBtn
              pointer
              text={<i className="fa-solid fa-shield"></i>}
              onClick={(e) => addRemoveBlock(e, 1)}
              id="team1block"
            />
            <KeyboardBtn
              pointer
              text={<i className="fa-solid fa-hourglass-start"></i>}
              onClick={
                timeouts.team1 > 6 ? () => {} : (e) => addMinuteBreak(e, 1)
              }
              gray={timeouts.team1 >= 6 ? true : false}
              id="team1timeout"
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
            ref={playButton}
          >
            <i
              className={
                pause ? "fa-solid fa-play fa-xl" : "fa-solid fa-pause fa-xl"
              }
            ></i>
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
              fouls.team2 >= 4 ? "foul__container full" : "foul__container"
            }
          >
            <span className={fouls.team2 >= 1 ? "foul active" : "foul"}></span>
            <span className={fouls.team2 >= 2 ? "foul active" : "foul"}></span>
            <span className={fouls.team2 >= 3 ? "foul active" : "foul"}></span>
            <span className={fouls.team2 >= 4 ? "foul active" : "foul"}></span>
            <span className={fouls.team2 >= 5 ? "foul active" : "foul"}></span>
          </div>
          <div className="btnCont">
            <KeyboardBtn
              pointer
              text={<i className="fa-solid fa-circle-xmark"></i>}
              onClick={(e) => addRemoveFoul(e, 2)}
              id="team2foul"
            />
            <KeyboardBtn
              pointer
              text={<i className="fa-solid fa-shield"></i>}
              onClick={(e) => addRemoveBlock(e, 2)}
              id="team2block"
            />
            <KeyboardBtn
              pointer
              text={<i className="fa-solid fa-hourglass-start"></i>}
              onClick={
                timeouts.team2 > 6 ? () => {} : (e) => addMinuteBreak(e, 2)
              }
              gray={timeouts.team2 >= 6 ? true : false}
              id="team2timeout"
            />
          </div>
        </div>
      </div>
      <div className="gameInfo">
        <h3>
          {/* {time % 600 > 9
                        ? (time - (time % 60)) / 60 + ":" + (time % 60)
                        : (time - (time % 60)) / 60 + ":" + "0" + (time % 60)} */}
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
          <b>Periods {quarter}</b>
        </h4>
        <p>
          <b style={{ fontWeight: 900 }}>
            {gameData.id
              ? "ABCDEFGHIJKLMNOP"
                  .split("")
                  .slice(gameData.gamegroup, gameData.gamegroup + 1)[0]
              : "N/A"}
          </b>{" "}
          grupa
        </p>
        <p>{gameData.venue ? gameData.venue : "Turnīra galvenā arēna"}</p>
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
    </div>
  );
}
