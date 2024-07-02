// TODO: create countdown animation
// TODO: responsive design
// TODO: foul overlay
import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";

import "./watch.css";
import StartAnimation from "./../../components/game/start-anim/start-anim";

const Watch = () => {
  const params = useParams();
  const [gameData, setGameData] = useState({
    team1: {
      name: "Lādējās",
      score: 0,
      fouls: 0,
      foulDetails: [],
    },
    team2: {
      name: "Lādējās",
      score: 0,
      fouls: 0,
      foulDetails: [],
    },
    period: 1,
    group: 0,
    venue: "Turnīra galvenā arēna",
  });
  const [time, setTime] = useState(6000);
  const [paused, setPaused] = useState(true);
  const [time24s, setTime24s] = useState(240);
  const [timeoutTime, setTimeoutTime] = useState(0);
  const [getUpdates, setGetUpdates] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [start, setStart] = useState(false);

  const timer = useRef();
  const timer24s = useRef();

  // Get data from API
  const getData = async () => {
    const { id } = params;

    const gameRequest = await fetch(
      "http://localhost:8080/api/live/games/once/" + id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const res = await gameRequest.json();
    console.log(res);

    setGameData({
      team1: {
        name: res[0].team1_name,
        score: res[0].team1_points,
        fouls: res[0].team1_fouls,
        foulDetails: JSON.parse(res[0].team1_fouls_details),
        timeouts: res[0].team1_timeouts,
      },
      team2: {
        name: res[0].team2_name,
        score: res[0].team2_points,
        fouls: res[0].team2_fouls,
        foulDetails: JSON.parse(res[0].team2_fouls_details),
        timeouts: res[0].team2_timeouts,
      },
      period: res[0].quarter,
      group: res[0].game_group,
      venue: res[0].venue,
    });

    if (res[0].paused) {
      console.log("paused");
      setPaused(true);
      setTime(res[0].game_time);
      setTime24s(res[0].timer_24s);
    } else {
      setPaused(false);

      const updateTime = new Date(res[0].timestamp).getTime();
      const currentTime = new Date().getTime();
      const gameTime =
        res[0].game_time - Math.floor((currentTime - updateTime) / 100);
      const time24s =
        res[0].timer_24s - Math.floor((currentTime - updateTime) / 100);

      setTime(gameTime);
      setTime24s(time24s);

      timer24s.current.postMessage({
        message: "START 24S",
        interval: 100,
      });
      timer.current.postMessage({ message: "START", interval: 100 });
    }

    setGetUpdates(true);
  };

  // Set up event stream
  React.useEffect(() => {
    if (getUpdates === false) return;

    const eventStream = new EventSource(
      "http://localhost:8080/api/live/games/" + getUpdates,
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

  // Update data from event stream
  React.useEffect(() => {
    if (!updateData) return;
    const data = JSON.parse(updateData);

    // Pause handling
    if (data.paused !== paused) {
      setPaused(!paused);
      if (data.paused) {
        timer.current.postMessage({ message: "STOP" });
        timer24s.current.postMessage({ message: "STOP" });
        console.log(`[PAUSE] Game paused at ${time} seconds remaining.`);
      } else {
        if (time24s <= 0) {
          setTime24s(240);
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
      }
    }

    // Quarters
    if (data.quarter !== gameData.period)
      setGameData((prev) => ({ ...prev, period: data.quarter }));

    // Timeouts
    if (data.team1_timeouts !== gameData.team1.timeouts) {
      setTimeoutTime(60);
      setGameData((prev) => ({
        ...prev,
        team1: {
          ...prev.team1,
          timeouts: data.team1_timeouts,
        },
      }));
      timer.current.postMessage({
        message: "START TIMEOUT",
        interval: 1000,
      });
    }

    if (data.team2_timeouts !== gameData.team2.timeouts) {
      setTimeoutTime(60);
      setGameData((prev) => ({
        ...prev,
        team2: {
          ...prev.team2,
          timeouts: data.team2_timeout,
        },
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
    if (data.team1Points !== gameData.team1.score) {
      // Get animation ready
      document.getElementById("team1addPoints").innerText = `+${
        data.team1Points - gameData.team1.score
      }`;
      document.getElementById("team1pointsNum").classList.add("active");

      setTimeout(() => {
        document.getElementById("team1pointsNum").classList.remove("active");
      }, 1500);

      // Add points to the team after 0.5s delay, to avoid showing before animation
      setTimeout(() => {
        setGameData((prev) => ({
          ...prev,
          team1: {
            ...prev.team1,
            score: data.team1Points,
          },
        }));
      }, 500);
    }

    if (data.team2Points !== gameData.team2.score) {
      // Get animation ready
      document.getElementById("team2addPoints").innerText = `+${
        data.team2Points - gameData.team2.score
      }`;
      document.getElementById("team2pointsNum").classList.add("active");

      setTimeout(() => {
        document.getElementById("team2pointsNum").classList.remove("active");
      }, 1500);

      // Add points to the team after 0.5s delay, to avoid showing before animation
      setTimeout(() => {
        setGameData((prev) => ({
          ...prev,
          team2: {
            ...prev.team2,
            score: data.team2Points,
          },
        }));
      }, 500);
    }

    // Fouls
    if (data.team1Fouls !== gameData.team1.fouls)
      setGameData((prev) => ({
        ...prev,
        team1: {
          ...prev.team1,
          fouls: data.team1Fouls,
        },
      }));
    if (data.team2Fouls !== gameData.team2.fouls)
      setGameData((prev) => ({
        ...prev,
        team2: {
          ...prev.team2,
          fouls: data.team1Fouls,
        },
      }));

    if (data.team1FoulDetails !== JSON.stringify(gameData.team1.foulDetails))
      setGameData((prev) => ({
        ...prev,
        team1: {
          ...prev.team1,
          foulDetails: JSON.parse(data.team1FoulDetails),
        },
      }));

    if (data.team2FoulDetails !== JSON.stringify(gameData.team2.foulDetails))
      setGameData((prev) => ({
        ...prev,
        team2: {
          ...prev.team2,
          foulDetails: JSON.parse(data.team1FoulDetails),
        },
      }));
  }, [updateData]);

  // Get data on load
  React.useEffect(() => {
    getData();
    if (localStorage.getItem("background")) {
      changeBackground(localStorage.getItem("background"));
    } else {
      changeBackground("defaultBackg");
    }
  }, []);

  // Set up web worker
  React.useEffect(() => {
    timer.current = new Worker(new URL("./timer.js", import.meta.url));
    timer24s.current = new Worker(new URL("./timer.js", import.meta.url));

    return () => {
      timer.current.terminate();
      timer24s.current.terminate();
    };
  }, []);

  // Set up web worker listener
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

  // Change background & style
  const changeBackground = (newID) => {
    document.querySelector(".display.active").classList.remove("active");

    switch (newID) {
      case "defaultBackg":
        document.getElementById("defaultDisplay").classList.add("active");
        localStorage.setItem("background", "defaultBackg");
        break;
      case "backg2":
        document.getElementById("display2").classList.add("active");
        localStorage.setItem("background", "backg2");
        break;
      case "backg3":
        document.getElementById("display3").classList.add("active");
        localStorage.setItem("background", "backg3");
        break;
      case "backg4":
        document.getElementById("display4").classList.add("active");
        localStorage.setItem("background", "backg4");
        break;
      case "backg5":
        document.getElementById("display5").classList.add("active");
        localStorage.setItem("background", "backg5");
        break;
      case "backg6":
        document.getElementById("display6").classList.add("active");
        localStorage.setItem("background", "backg6");
        break;
      case "backg7":
        document.getElementById("display7").classList.add("active");
        localStorage.setItem("background", "backg7");
        break;
      default:
        document.getElementById("defaultDisplay").classList.add("active");
        localStorage.setItem("background", "defaultBackg");
        break;
    }

    document.querySelector(".watch__cont").classList = "watch__cont " + newID;
  };

  return (
    <div className="watch__cont">
      <StartAnimation start={start} />
      <div className="colorBar" id="topBar"></div>
      <p className="topBarText">
        #Atbalsti<span className="bold">Savējos</span>
      </p>
      <div className="teamsCont">
        <div className="team">
          <h3 className="name">{gameData.team1.name}</h3>
          <div className="points__cont">
            <h2 className="score" id="team1pointsNum">
              {gameData.team1.score}
              <div id="team1addPoints"></div>
            </h2>
          </div>
          <span className="foulNum">{gameData.team1.fouls}</span>
          <div
            className={
              gameData.team1.fouls >= 4
                ? "foul__container full"
                : "foul__container"
            }
          >
            <span
              className={gameData.team1.fouls >= 1 ? "foul active" : "foul"}
            ></span>
            <span
              className={gameData.team1.fouls >= 2 ? "foul active" : "foul"}
            ></span>
            <span
              className={gameData.team1.fouls >= 3 ? "foul active" : "foul"}
            ></span>
            <span
              className={gameData.team1.fouls >= 4 ? "foul active" : "foul"}
            ></span>
            <span
              className={gameData.team1.fouls >= 5 ? "foul active" : "foul"}
            ></span>
          </div>
        </div>
        <div className="team right">
          <h3 className="name">{gameData.team2.name}</h3>
          <div className="points__cont">
            <h2 className="score" id="team2pointsNum">
              {gameData.team2.score}
              <div id="team2addPoints"></div>
            </h2>
          </div>
          <span className="foulNum">{gameData.team2.fouls}</span>
          <div
            className={
              gameData.team2.fouls >= 4
                ? "foul__container full"
                : "foul__container"
            }
          >
            <span
              className={gameData.team2.fouls >= 1 ? "foul active" : "foul"}
            ></span>
            <span
              className={gameData.team2.fouls >= 2 ? "foul active" : "foul"}
            ></span>
            <span
              className={gameData.team2.fouls >= 3 ? "foul active" : "foul"}
            ></span>
            <span
              className={gameData.team2.fouls >= 4 ? "foul active" : "foul"}
            ></span>
            <span
              className={gameData.team2.fouls >= 5 ? "foul active" : "foul"}
            ></span>
          </div>
        </div>
      </div>
      <div className="largeInfoCont">
        <div className="timeCont">
          <h5
            style={
              time24s > 50 ? { margin: "0" } : { margin: "0", color: "#CE0000" }
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
          <p>
            <b>Periods {gameData.period}</b>
          </p>
          <span className="periodNum">4</span>
        </div>
        <div className="infoCont">
          <p>
            <b>
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                .split("")
                .slice(gameData.group, parseInt(gameData.group) + 1)}
            </b>{" "}
            grupa
          </p>
          <p>{gameData.venue ? gameData.venue : "Turnīra galvenā arēna"}</p>
        </div>
      </div>
      <div className="colorBar" id="bottomBar"></div>
      <i
        class="fa-solid fa-pen editBtn"
        onClick={() => {
          document.querySelector(".customizeOverlay").style.display = "flex";
        }}
      ></i>
      <div className="customizeOverlay">
        <div className="customizeOverlayData">
          <i
            className="fa-solid fa-close"
            onClick={() => {
              document.querySelector(".customizeOverlay").style.display =
                "none";
            }}
          ></i>
          <h3>Pielāgot</h3>
          <p>Iestati fonu & stilu</p>
          <div className="displaysCont">
            <div
              className="display active"
              id="defaultDisplay"
              onClick={() => changeBackground("defaultBackg")}
            ></div>
            <div
              className="display"
              id="display2"
              onClick={() => changeBackground("backg2")}
            ></div>
            <div
              className="display"
              id="display3"
              onClick={() => changeBackground("backg3")}
            ></div>
            <div
              className="display"
              id="display4"
              onClick={() => changeBackground("backg4")}
            ></div>
            <div
              className="display"
              id="display5"
              onClick={() => changeBackground("backg5")}
            ></div>
            <div
              className="display"
              id="display6"
              onClick={() => changeBackground("backg6")}
            ></div>
            <div
              className="display"
              id="display7"
              onClick={() => changeBackground("backg7")}
            ></div>
          </div>
          <p
            style={{
              marginBottom: 0,
              fontSize: "10px",
              marginTop: "20px",
            }}
          >
            Dažas bildes ņemtas no Freepik
          </p>
        </div>
      </div>
    </div>
  );
};

export default Watch;
