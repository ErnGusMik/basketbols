import React from "react";

import "./settings.css";
import Button from "../../../components/button/button";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("id_token");
    localStorage.clear();
    navigate("/login");
  };

  const [lang, setLang] = React.useState(Boolean(localStorage.getItem("lang")));

  return (
    <div className="settingsCont">
      <div className="setting">
        <div className="disabledOverlay">
          {lang ? "Coming soon!" : "Būs pieejams drīzumā!"}
        </div>
        <h2>{lang ? "Dark mode" : "Tumšais režīms"}</h2>
        <label class="switch">
          <input type="checkbox" />
          <span class="slider"></span>
        </label>
      </div>
      <div className="logoutCont">
        <Button text={lang ? "Log out" : "Atslēgties"} onClick={logout} />
      </div>
    </div>
  );
};

export default Settings;
