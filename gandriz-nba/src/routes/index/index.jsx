import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./index.css";
import bannerImg from "./banner.png";
import Button from "../../components/button/button";

const Index = () => {
  // Set to localstorage language preference
  const [lang, setLang] = useState(Boolean(localStorage.getItem("lang")));
  const changeLanguage = () => {
    if (localStorage.getItem("lang") === "en") {
      localStorage.removeItem("lang");
      setLang(false);
      return;
    }
    localStorage.setItem("lang", "en");
    setLang(true);
  };

  return (
    <div className="index">
      <i className="fa-solid fa-globe" onClick={changeLanguage} />
      <div className="banner">
        <div className="bannerText">
          <h1>
            {lang
              ? "Creating a basketball tournament has never been easier"
              : "Izveidot basketbola turnīru nekad nav bijis tik viegli"}
          </h1>
          <p>
            {lang
              ? "Creating and managing a basketball tournament is a breeze with Gandrīz NBA! Keep track of games & team achievements, publish your tournament for everyone to see and much more, all for free!"
              : "Ar Gandrīz NBA padari turnīru veidošanu un menedžēšanu daudz vienkāršāku! Skaiti spēļu & komandu sasniegumus, padari turnīra informāciju visiem pieejamu un daudz ko citu, visu par brīvu!"}
          </p>
          <Link to={"/app"}>
            <Button text={lang ? "Create a tournament" : "Izveidot turnīru"} />
          </Link>
        </div>
        <img src={bannerImg} alt="Man with basketball jumping" />
      </div>
      <p className="attribution">
        {lang
          ? "Background -- svgbackgrounds.com, photo -- freepik.com"
          : "Fons -- svgbackgrounds.com, bilde -- freepik.com"}
      </p>
    </div>
  );
};

export default Index;
