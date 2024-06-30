// TODO: Populate without data
// TODO: Every design has a class name, so it is easy to style it
import React from "react";

import "./watch.css";

const Watch = () => {
  return (
    <div className="watch__cont">
      <div className="teamsCont">
        <div className="team">
          <h3 className="name">Čempionu komanda!</h3>
          <h2 className="score">126</h2>
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
        </div>
        <div className="infoCont">
          <p>
            <b>A</b> grupa
          </p>
          <p>Skolas čempis 2024, Ogre</p>
        </div>
      </div>
      <i class="fa-solid fa-pen editBtn"></i>
    </div>
  );
};

export default Watch;
