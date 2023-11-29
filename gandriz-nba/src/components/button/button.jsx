import React from "react";

import "./button.css";

export default function Button({
  text = "",
  onClick = () => {},
  disabled = false,
}) {
  return (
    <button className="button" onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}
