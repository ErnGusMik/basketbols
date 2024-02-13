import React from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";

import "./instructions.css";

export default function Instructions() {
  const { id } = useParams();

  return (
    <div className="instructions">
      <h1>Kā skaitīt spēles statistiku?</h1>
      <div className="tabSelector">
        <div>
          <NavLink
            to={"/app/game/" + id + "/instructions/keyboard"}
            relative="path"
            className="tabSelector_1"
          >
            Klavietūra
          </NavLink>
        </div>
        <div>
          <NavLink
            to={"/app/game/" + id + "/instructions/mouse"}
            relative="path"
            className="tabSelector_2"
          >
            Pele
          </NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
