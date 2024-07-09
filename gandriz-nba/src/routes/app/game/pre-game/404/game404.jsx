import React from "react";

import "./game404.css";
import Button from "../../../../../components/button/button";
import { useNavigate } from "react-router-dom";

export default function Game404() {
  const navigate = useNavigate();
  const [lang, setLang] = React.useState(Boolean(localStorage.getItem("lang")));

  React.useEffect(() => {
    window.addEventListener("storage", () => {
      setLang(Boolean(localStorage.getItem("lang")));
    });

    return () => {
      window.removeEventListener("storage", () => {
        setLang(Boolean(localStorage.getItem("lang")));
      });
    };
  }, []);

  document.title = lang
    ? "Game not found | Gandriz NBA"
    : "Neatradām spēli | Gandriz NBA";

  return (
    <div className="game404">
      <h1>
        4<i class="fa-solid fa-basketball" />4
      </h1>
      <h2>
        {lang
          ? "It seems to us that you have arrived at the wrong arena"
          : "Mums izskatās, ka esi ieradies nepareizajā arēnā"}
        ...
      </h2>
      <p>
        {lang
          ? "We couldn't find the game you were looking for"
          : "Mēs neatradām spēli ko meklēji"}{" "}
        :-(
      </p>
      <p>
        {lang
          ? "Try again or contact us!"
          : "Pamēģini vēlreiz vai sazinies ar mums!"}
      </p>
      <br />
      <Button
        text={lang ? "Back to home" : "Atpakaļ uz sākumu"}
        onClick={() => {
          navigate("/app");
        }}
      />
    </div>
  );
}
