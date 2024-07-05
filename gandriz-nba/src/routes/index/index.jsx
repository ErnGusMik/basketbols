import React from "react";
import { Link } from "react-router-dom";

import "./index.css";
import bannerImg from "./banner.png";
import Button from "../../components/button/button";

const Index = () => {
  return (
    <div className="index">
      <div className="banner">
        <div className="bannerText">
          <h1>Izveidot basketbola turnīru nekad nav bijis tik viegli</h1>
          <p>
            Ar Gandrīz NBA padari turnīru veidošanu un menedžēšanu daudz
            vienkāršāku! Skaiti spēļu & komandu sasniegumus, padari turnīra
            informāciju visiem pieejamu un daudz ko citu, visu par brīvu!
          </p>
          <Link to={"/app"}>
            <Button text="Izveidot turnīru" />
          </Link>
        </div>
        <img src={bannerImg} alt="Man with basketball jumping" />
      </div>
      <p className="attribution">
        Fons -- svgbackgrounds.com, bilde -- freepik.com
      </p>
    </div>
  );
};

export default Index;
