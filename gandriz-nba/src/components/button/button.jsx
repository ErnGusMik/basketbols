import React from "react";

import "./button.css";

export default function Button({
  text = "",
  icon = "",
  onClick = () => {},
  disabled = false,
}) {
  return (
    <button className="button" onClick={onClick} disabled={disabled}>
      {icon ? icon : ""}
      <p>{text}</p>
    </button>
  );
}
