// TODO: Add designs
// TODO: Every design has a class name, so it is easy to style it
import React from "react";

import "./watch.css";

const Watch = () => {
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
      <div className="teamsCont">
        <div className="team">
          <h3 className="name">Čempionu komanda!</h3>
          <h2 className="score">126</h2>
          <span className="foulNum">3</span>
          <div className="foul__container">
            <span className="foul active"></span>
            <span className="foul active"></span>
            <span className="foul active"></span>
            <span className="foul"></span>
            <span className="foul"></span>
          </div>
        </div>
        <div className="team right">
          <h3 className="name">Ogres SC</h3>
          <h2 className="score">89</h2>
          <span className="foulNum">5</span>
          <div className="foul__container full">
            <span className="foul active"></span>
            <span className="foul active"></span>
            <span className="foul active"></span>
            <span className="foul active"></span>
            <span className="foul active"></span>
          </div>
        </div>
      </div>
      <div className="largeInfoCont">
        <div className="timeCont">
          <h3>9:34</h3>
          <p>
            <b>Periods 4</b>
          </p>
          <span className="periodNum">4</span>
        </div>
        <div className="infoCont">
          <p>
            <b>A</b> grupa
          </p>
          <p>Skolas čempis 2024, Ogre</p>
        </div>
      </div>
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
        </div>
      </div>
    </div>
  );
};

export default Watch;
