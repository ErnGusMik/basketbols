import React from "react";

import "./keyboard-button.css";

export default function KeyboardBtn({ text, caption, small, gray }) {
    return (
        <div className="keyboardBtn__cont">
            <div
                className="keyboardBtn"
                style={
                    small
                        ? gray
                            ? {
                                  width: "30px",
                                  height: "30px",
                                  fontSize: "10px",
                                  borderRadius: "5px",
                                  color: "#D9D9D9",
                                  border: "1px solid #D9D9D9",
                                  margin: "0 5px",
                              }
                            : {
                                  width: "30px",
                                  height: "30px",
                                  fontSize: "10px",
                                  borderRadius: "5px",
                                  margin: "0 5px",
                              }
                        : {}
                }
            >
                <h2>{text}</h2>
            </div>
            {caption && <p>{caption}</p>}
        </div>
    );
}
