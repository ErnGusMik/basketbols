import React from "react";
import "./root.css";

export default function Root() {
  const setWidth = (text) => {
    if (text.length > 11) {
      return text.substring(0, 10) + "...";
    }
    return text;
  };
  return (
    <div className="root">
      <div className="horizontalNav-main">
        <div className="horizontalNav-logo">
          <img src="x" alt="GandrīzNBA logo" />
        </div>
        <div className="horizontalNav-breadcrumbs">
          <i class="fa-solid fa-chevron-right horizontalNav-sign"></i>
          <p id="breadcrumbs">Jauns turnīrs</p>
        </div>
      </div>
      <div className="verticalNav-main">
        <div className="verticalNav-content">
          <div className="verticalNav-home">
            <div className="verticalNav-line verticalNav-active">
              <i class="fa-solid fa-house"></i>
              <p>Sākums</p>
            </div>
            <hr />
          </div>
          <div className="verticalNav-tournaments">
            <div className="verticalNav-line">
              <i class="fa-solid fa-basketball"></i>
              <p>{setWidth("Skolas čempionāts")}</p>
            </div>
            <div className="verticalNav-line">
              <i class="fa-solid fa-plus"></i>
              <p>Jauns turnīrs</p>
            </div>
          </div>
        </div>
        <div className="verticalNav-line verticalNav-settings">
          <i class="fa-solid fa-gear"></i>
          <p>Iestatījumi</p>
        </div>
      </div>
    </div>
  );
}
