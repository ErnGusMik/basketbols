// TODO: Add games, groups tables and tournament stats
import React from "react";

import "./public.css";

export default function PublicPage() {
  return (
    <div className="publicPage__cont">
      <div className="banner">
        <h1>Skolas čempis 2023</h1>
      </div>
      <div className="row">
        <div className="desc__cont element">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio,
            odio delectus, blanditiis corrupti hic rerum vel explicabo natus
            distinctio ratione voluptatibus aperiam quia minus, fuga cum dolores
            repudiandae minima consequuntur?
          </p>
          <div>
            <i class="fa-solid fa-location-dot"></i>
            <p>Ogre</p>
          </div>
          <p>Organizē Ogres 1. vidusskola</p>
        </div>
        <div className="spacerImg element"></div>
        <div className="jump__cont element">
          <p>Lekt uz:</p>
          <ul>
            <li>
              <a>Tagad</a>
            </li>
            <li>
              <a>Spēles</a>
            </li>
            <li>
              <a>Grupas</a>
            </li>
            <li>
              <a>Statistika</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="game">
          <div className="teams">
            <div className="team">
              <img src="main.jpg" alt="Team logo (symbolic meaning)" />
              <h3>Čempionu komanda!</h3>
            </div>
            <h3 className="vs">VS</h3>
            <div className="team">
              <img src="main.jpg" alt="Team logo (symbolic meaning)" />
              <h3>Ceturtās klases vilki</h3>
            </div>
          </div>
          <div className="gameData__cont">
            <h2>130</h2>
            <div className="gameData">
              <p>A grupa</p>
              <p>03/12/2024</p>
              <p>12:00</p>
            </div>
            <h2>89</h2>
          </div>
          <div className="live__content">
            <i className="fa-solid fa-circle"></i>
            <p>LIVE</p>
          </div>
        </div>
        <div className="game live">
          <div className="teams">
            <div className="team">
              <img src="main.jpg" alt="Team logo (symbolic meaning)" />
              <h3>Čempionu komanda!</h3>
            </div>
            <h3 className="vs">VS</h3>
            <div className="team">
              <img src="main.jpg" alt="Team logo (symbolic meaning)" />
              <h3>Ceturtās klases vilki</h3>
            </div>
          </div>
          <div className="gameData__cont">
            <h2>130</h2>
            <div className="gameData">
              <p>A grupa</p>
              <p>03/12/2024</p>
              <p>12:00</p>
            </div>
            <h2>89</h2>
          </div>
          <div className="live__content">
            <i className="fa-solid fa-circle"></i>
            <p>LIVE</p>
          </div>
        </div>
        <div className="game">
          <div className="teams">
            <div className="team">
              <img src="main.jpg" alt="Team logo (symbolic meaning)" />
              <h3>Čempionu komanda!</h3>
            </div>
            <h3 className="vs">VS</h3>
            <div className="team">
              <img src="main.jpg" alt="Team logo (symbolic meaning)" />
              <h3>Ceturtās klases vilki</h3>
            </div>
          </div>
          <div className="gameData__cont">
            <h2>130</h2>
            <div className="gameData">
              <p>A grupa</p>
              <p>03/12/2024</p>
              <p>12:00</p>
            </div>
            <h2>89</h2>
          </div>
          <div className="live__content">
            <i className="fa-solid fa-circle"></i>
            <p>LIVE</p>
          </div>
        </div>
      </div>
      <div className="games"></div>
      <div className="groups"></div>
      <div className="stats"></div>
      <footer>
        <div>
          <p>&copy; Copyright {new Date().getFullYear()} Ogres 1. vidusskola</p>
          <p>All rights reserved.</p>
          <p>Visas tiesības aizsargātas.</p>
        </div>
        <p>
          Izveidots izmantojot <a href="#">Gandrīz NBA</a>
        </p>
      </footer>
    </div>
  );
}
