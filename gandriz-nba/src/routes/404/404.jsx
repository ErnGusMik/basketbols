import React from "react";
import { Link } from "react-router-dom";

import "./404.css";
import basketball from "./basketball-white.svg";

const NotFound = () => {
  const [lang, setLang] = React.useState(Boolean(localStorage.getItem("lang")));

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
    <div className="notFound">
      <i
        className="fa-solid fa-globe"
        style={{
          fontFamily: "Font Awesome 5 Free",
          position: "absolute",
          top: "30px",
          right: "30px",
          cursor: "pointer",
        }}
        onClick={changeLanguage}
      />
      <h1>
        4<img src={basketball} alt="0" />4
      </h1>
      <h2>
        {lang
          ? "Seems like you have arrived to the wrong arena"
          : "Mums izskatās ka esi ieradies nepareizajā arēnā"}
        ...
      </h2>
      <h3>
        {lang
          ? "We didn't find the page you were looking for"
          : "Mēs neatradām lapu kuru meklēji"}{" "}
        :-(
      </h3>
      <Link to="/">
        <button className="toHome">{lang ? "Home" : "Uz sākumu"}</button>
      </Link>
      <footer>
        <p>&copy; {new Date().getFullYear()} Gandrīz NBA</p>
      </footer>
    </div>
  );
};

export default NotFound;
