import "./input.css";
import React from "react";
import image from "./main.jpg";

export default function FileInput({
  label = "",
  placeholder = "",
  inputID = "",
  accept = "image/*",
  notes = "",
  notes2 = "",
}) {
  const manageCancel = (e) => {
    e.preventDefault();
    document.getElementById(`${inputID}-warning`).value =
      "&#9432; Šis lauks ir obligāts";
    document.getElementById(inputID).attributes.className = "input-error";
  };
  let file = image;
  const manageChange = (e) => {
    e.preventDefault();
    if (file) {
      let reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById(inputID + "-image").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="flexCont">
      <div className="fileInput-container">
        <div className="fileInput-content">
          <label htmlFor={inputID}>
            <p>{label}</p>
            <span className="customUplaod">
              <i className="fa-solid fa-plus"></i>
              <p>Pievienot bildi</p>
            </span>
          </label>
          <input
            type="file"
            id={inputID}
            name={inputID}
            placeholder={placeholder}
            accept={accept}
            onCancel={manageCancel}
            onChange={manageChange}
          />
          <p className="fileInput-notes">
            {notes}
            <br />
            {notes2}
          </p>
          <p id={inputID + "-warning"}></p>
        </div>
        <div className="fileInput-image">
          <img className={inputID + "-image"} src={file} alt="Turnīra logo" />
        </div>
      </div>
    </div>
  );
}
