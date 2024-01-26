import React from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import "./tournament-nav.css";

export default function TournamentNav() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [active1, setActive1] = React.useState(false);
  const [active2, setActive2] = React.useState(false);
  const [active3, setActive3] = React.useState(false);
  const [active4, setActive4] = React.useState(false);

  const getCurrentPage = () => {
    const link = window.location.href;
    const linkArray = link.split("/");
    const currentPage = linkArray[linkArray.length - 1];
    switch (currentPage) {
      case "about":
        return 1;
      case "teams":
        return 2;
      case "stats":
        return 3;
      case "games":
        return 4;
      default:
        return 1;
    }
  };

  const navigateToAbout = () => {
    navigate("/app/tournaments/" + id + "/about");
  };

  React.useEffect(() => {
    const currentPage = getCurrentPage();
    switch (currentPage) {
      case 1:
        setActive1(true);
        break;
      case 2:
        setActive2(true);
        break;
      case 3:
        setActive3(true);
        break;
      case 4:
        setActive4(true);
        break;
      default:
        setActive1(true);
        break;
    }
    navigateToAbout();
  }, []);

  return (
    <div className="tournament__container">
      <div className="tournament-nav">
        <div className="tournament-nav-item" id="tournament-nav-1">
          <Link to={"/app/tournaments/" + id + "/about"}>Info</Link>
          <span className={active1 ? "active tabLine" : "tabLine"}></span>
        </div>
        <div className="tournament-nav-item" id="tournament-nav-2">
          <Link to={"/app/tournaments/" + id + "/teams"}>Komandas</Link>
          <span className={active2 ? "active tabLine" : "tabLine"}></span>
        </div>
        <div className="tournament-nav-item" id="tournament-nav-3">
          <Link to={"/app/tournaments/" + id + "/stats"}>Statistika</Link>
          <span className={active3 ? "active tabLine" : "tabLine"}></span>
        </div>
        <div className="tournament-nav-item" id="tournament-nav-4">
          <Link to={"/app/tournaments/" + id + "/games"}>Spēles</Link>
          <span className={active4 ? "active tabLine" : "tabLine"}></span>
        </div>
      </div>
      <div id="tournamentOutlet">
        <Outlet />
      </div>
    </div>
  );
}
