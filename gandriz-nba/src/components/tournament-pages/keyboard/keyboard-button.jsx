import React from "react";

import "./keyboard-button.css";

export default function KeyboardBtn({ text, caption, small, gray }) {
  return (
    <div className="keyboardBtn__cont">
      <div
        className={
          small
            ? gray
              ? "keyboardBtn keyboardBtn__small keyboardBtn__gray"
              : "keyboardBtn keyboardBtn__small"
            : "keyboardBtn"
        }
      >
        <h2>{text}</h2>
      </div>
      {caption && <p>{caption}</p>}
    </div>
  );
}
