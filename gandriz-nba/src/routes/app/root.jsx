import React from "react";
import "./root.css";
import { Outlet, Link, useNavigate } from "react-router-dom";

export default function Root() {
  const navigate = useNavigate();

  const setWidth = (text) => {
    if (text.length > 11) {
      return text.substring(0, 10) + "...";
    }
    return text;
  };
  let menuOpen = false;
  const showMenu = () => {
    if (!menuOpen) {
      document.querySelector(".verticalNav-main").style.left = "0px";
      document.querySelector(".verticalNav-overlay").style.visibility =
        "visible";
      document.querySelector(".verticalNav-overlay").style.opacity = "1";
      menuOpen = true;
    } else {
      document.querySelector(".verticalNav-main").style.left = "-300px";
      document.querySelector(".verticalNav-overlay").style.visibility =
        "hidden";
      document.querySelector(".verticalNav-overlay").style.opacity = "0";
      menuOpen = false;
    }
  };

  // Check if user is logged in
  const loggedIn = () => {
    const accessToken = localStorage.getItem("access_token");
    const idToken = localStorage.getItem("id_token");
    const refreshToken = localStorage.getItem("refresh_token");
    if (!accessToken || !idToken || !refreshToken) {
      console.log("User is not logged in");
      return false;
    }
    return true;
  };

  React.useEffect(() => {
    if (!loggedIn()) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="root">
      <div className="verticalNav-overlay"></div>
      <div className="verticalNav-menuButton" onClick={showMenu}>
        <i className="fa-solid fa-bars-staggered"></i>
      </div>
      <div className="horizontalNav-main">
        <div className="horizontalNav-logo">
          <Link to="/app">
            <img src="x" alt="GandrīzNBA logo" />
          </Link>
        </div>
        <div className="horizontalNav-breadcrumbs">
          <i className="fa-solid fa-chevron-right horizontalNav-sign"></i>
          <p id="breadcrumbs">Jauns turnīrs</p>
        </div>
      </div>
      <div className="verticalNav-main">
        <div className="verticalNav-content">
          <div className="verticalNav-menuButtonClose" onClick={showMenu}>
            <i className="fa-solid fa-xmark"></i>
          </div>
          <div className="verticalNav-home">
            <div className="verticalNav-line verticalNav-active">
              <Link to="/app">
                <i className="fa-solid fa-house"></i>
                <p>Sākums</p>
              </Link>
            </div>
            <hr />
          </div>
          <div className="verticalNav-tournaments">
            <div className="verticalNav-line">
              <Link to="/app">
                <i className="fa-solid fa-basketball"></i>
                <p>{setWidth("Skolas čempionāts")}</p>
              </Link>
            </div>
            <div className="verticalNav-line">
              <Link to="/app/tournaments/new">
                <i className="fa-solid fa-plus"></i>
                <p>Jauns turnīrs</p>
              </Link>
            </div>
          </div>
        </div>
        <div className="verticalNav-line verticalNav-settings">
          <Link to="/app/settings">
            <i className="fa-solid fa-gear"></i>
            <p>Iestatījumi</p>
          </Link>
        </div>
      </div>
      <div id="mainOutlet">
        <Outlet />
      </div>
    </div>
  );
}
