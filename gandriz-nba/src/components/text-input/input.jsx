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
  return (
    <div className="textInput-container">
      <label htmlFor={inputID}>{label}</label>
      <input
        type={type}
        id={inputID}
        name={inputID}
        placeholder={placeholder}
        onChange={onChange ? onChange : replaceWithValue}
      />
      <p id={inputID + "-notes"}>{notes}</p>
    </div>
  );
}
