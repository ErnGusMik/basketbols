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
  required = false,
}) {
  const manageCancel = (e) => {
    e.preventDefault();
    document.getElementById(`${inputID}-warning`).innerHTML =
      "&#9432; Šis lauks ir obligāts";
    document.getElementById(inputID+"-warning").classList.add = "input-error";
  };
  let file = image;
  const manageChange = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      let reader = new FileReader();
      let file = e.target.files[0];
      reader.readAsDataURL(file);
      reader.onloadend = function (e) {
        document.getElementById(inputID + "-image").src =
          reader.result;
      };
    } else {
      document.getElementById(inputID + "-image").src = image;
    }
  };
  return (
    <div className="flexCont">
      <div className="fileInput-container">
        <div className="fileInput-content">
          <label htmlFor={inputID}>
            <p>{label}</p>
            <span className="customUplaod">
              <i className="fa-solid fa-plus" />
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
            required={required}
          />
          <p className="fileInput-notes">
            {notes}
            <br />
            {notes2}
          </p>
          <p id={inputID + "-warning"} className="fileInput-warning" />
        </div>
        <div className="fileInput-image">
          <img id={inputID + "-image"} src={file} alt="Turnīra logo" />
        </div>
      </div>
    </div>
  );
}
