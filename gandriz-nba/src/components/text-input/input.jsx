import "./input.css";
import { useState, useEffect } from "react";

export default function TextInput({
  label = "",
  placeholder = "",
  inputID = "",
  type = "text",
  notes = "",
  notesValue = false,
  onChange = null,
  required = false,
  error = false,
}) {
  const [value, setValue] = useState(notes);
  const originalValue = notes;
  const replaceWithValue = (e) => {
    e.preventDefault();
    if (notesValue) {
      setValue(originalValue + `<b>${e.target.value}</b>`);
    }
  };
  // Update notes when input value is changed
  useEffect(() => {
    document.getElementById(inputID + "-notes").innerHTML = value;
  }, [value]);
  useEffect(() => {
    if (!error) {
      document.getElementById(inputID + "-label").style.color = "black";
      document.getElementById(inputID).style.border = "0";
    } else {
      document.getElementById(inputID + "-label").style.color = "red";
      document.getElementById(inputID).style.border = "1px solid red";
    }
  }, [error]);
  return (
    <div className="textInput-container">
      <label htmlFor={inputID} id={inputID + "-label"}>
        {error ? <i class="fa-solid fa-triangle-exclamation"></i> : ""}
        {"   "}
        {label}
        {"   "}
        {error ? error : ""}
      </label>
      <input
        type={type}
        id={inputID}
        name={inputID}
        placeholder={placeholder}
        onChange={onChange ? onChange : replaceWithValue}
        required={required}
      />
      <p id={inputID + "-notes"}>{notes}</p>
    </div>
  );
}
