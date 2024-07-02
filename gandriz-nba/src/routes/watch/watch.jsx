// TODO: Get data, add score adding animation
// TODO: create countdown animation
// TODO: responsive design
// TODO: foul overlay
import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";

import "./watch.css";

const Watch = () => {
  const params = useParams();
  const [gameData, setGameData] = useState({
    team1: {
      name: "Lādējās",
      score: 0,
      fouls: 0,
    },
    team2: {
      name: "Lādējās",
      score: 0,
      fouls: 0,
    },
    period: 1,
    group: 0,
    venue: "Turnīra galvenā arēna",
  });
  const [time, setTime] = useState(3372);
  const [paused, setPaused] = useState(false);
  const [time24s, setTime24s] = useState(0);

  const timer = useRef();
  const timer24s = useRef();

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
      },
      team2: {
        name: res[0].team2_name,
        score: res[0].team2_points,
        fouls: res[0].team2_fouls,
      },
      period: res[0].quarter,
      group: res[0].game_group,
      venue: res[0].venue,
    });
    setTime(res[0].game_time);
  };

  React.useEffect(() => {
    getData();
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

  const changeBackground = (newID) => {
    document.querySelector(".display.active").classList.remove("active");

    switch (newID) {
      case "defaultBackg":
        document.getElementById("defaultDisplay").classList.add("active");
        break;
      case "backg2":
        document.getElementById("display2").classList.add("active");
        break;
      case "backg3":
        document.getElementById("display3").classList.add("active");
        break;
      case "backg4":
        document.getElementById("display4").classList.add("active");
        break;
      case "backg5":
        document.getElementById("display5").classList.add("active");
        break;
      case "backg6":
        document.getElementById("display6").classList.add("active");
        break;
      case "backg7":
        document.getElementById("display7").classList.add("active");
        break;
    }

    document.querySelector(".watch__cont").classList = "watch__cont " + newID;
  };

  return (
    <div className="watch__cont defaultBackg">
      <div className="colorBar" id="topBar"></div>
      <p className="topBarText">
        #Atbalsti<span className="bold">Savējos</span>
      </p>
      <div className="teamsCont">
        <div className="team">
          <h3 className="name">{gameData.team1.name}</h3>
          <h2 className="score">{gameData.team1.score}</h2>
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
          <h2 className="score">{gameData.team2.score}</h2>
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
