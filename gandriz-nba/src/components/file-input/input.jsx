import "./input.css";
import React from "react";
import logo from './../../../public/main.jpg'


export default function FileInput({
  label = "",
  value = "",
  placeholder = "",
  inputID,
  accept = "image/*",
  notes = "",
}) {
  const manageCancel = (e) => {
    e.preventDefault();
    document.getElementById(`${inputID}-warning`).value =
      "&#9432; Šis lauks ir obligāts";
    document.getElementById(inputID).attributes.className = "input-error";
  };
  let file = '';
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
    <div className="fileInput-container">
      <div className="fileInput-content">
        <label htmlFor={inputID}>{label}</label>
        <input
          type="file"
          id={inputID}
          name={inputID}
          value={value}
          placeholder={placeholder}
          accept={accept}
          onCancel={manageCancel}
          onChange={manageChange}
        />
        <p>{notes}</p>
        <p id={inputID + "-warning"}></p>
      </div>
      <div className="fileInput-image">
        <img
          className={inputID + "-image"}
          src={file}
          alt='Turnīra logo'
        />
      </div>
    </div>
  );
}
