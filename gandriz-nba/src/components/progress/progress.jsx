import React from "react";

import "./progress.css";

export default function Progress({ progress = 1 }) {
  const circle2 = progress >= 2 ? "progressCircle-active" : "";
  const circle3 = progress >= 3 ? "progressCircle-active" : "";
  const circle4 = progress >= 4 ? "progressCircle-active" : "";

  const [lang, setLang] = React.useState(Boolean(localStorage.getItem("lang")));

  // Get localStorage updates
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

  return (
    <div className="progressCont">
      <div className="progress">
        <div className="progressSection">
          <div className="progressCircle progressCircle-active">
            <i className="fa-solid fa-circle-info" />
          </div>
          <p className="progressText">
            {lang ? "Tournament info" : "Turnīra info"}
          </p>
        </div>
        <div className="progressLine" />
        <div className="progressSection">
          <div className={"progressCircle " + circle2}>
            <i className="fa-solid fa-people-group" />
          </div>
          <p className="progressText">{lang ? "Teams" : "Komandas"}</p>
        </div>
        <div className="progressLine" />
        <div className="progressSection">
          <div className={"progressCircle " + circle3}>
            <i className="fa-solid fa-scale-balanced" />
          </div>
          <p className="progressText">{lang ? "Referees" : "Tiesneši"}</p>
        </div>
        <div className="progressLine" />

        <div className="progressSection">
          <div className={"progressCircle " + circle4}>
            <i className="fa-solid fa-gamepad" />
          </div>
          <p className="progressText">{lang ? "Matches" : "Spēles"}</p>
        </div>
      </div>
    </div>
  );
}
