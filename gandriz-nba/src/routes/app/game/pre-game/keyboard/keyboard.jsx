// TODO: finish this component
// TODO: make verticalNums appear centered vertically

import React from "react";

import "./keyboard.css";
import KeyboardBtn from "../../../../../components/tournament-pages/keyboard/keyboard-button";

export default function Keyboard() {
    return (
        <div className="keyboard__container">
            <div className="points horizontalCont verticalStart">
                <div className="flexCont">
                    <h2>Čempionu komanda!</h2>
                    <div className="horizontalCont center mainBtns">
                        <KeyboardBtn text="1" caption="+1 punkts" />
                        <KeyboardBtn text="2" caption="+2 punkti" />
                        <KeyboardBtn text="3" caption="+3 punkti" />
                    </div>
                    <div className="horizontalCont flexStart">
                        <KeyboardBtn text="1" small />
                        <KeyboardBtn text="2" small />
                        <KeyboardBtn text="3" small />
                        <KeyboardBtn text="4" small gray />
                        <KeyboardBtn text="5" small gray />
                        <KeyboardBtn text="6" small gray />
                        <KeyboardBtn text="7" small gray />
                        <KeyboardBtn text="8" small gray />
                        <KeyboardBtn text="9" small gray />
                        <KeyboardBtn text="0" small gray />
                    </div>
                </div>
                <div className="flexCont horizontalCont">
                    <div>
                        <h2>Ceturtās klases vilki</h2>
                        <div
                            className="horizontalCont center mainBtns"
                            id="pointsInstruction2"
                        >
                            <KeyboardBtn text="1" caption="+1 punkts" />
                            <KeyboardBtn text="2" caption="+2 punkti" />
                            <KeyboardBtn text="3" caption="+3 punkti" />
                        </div>
                    </div>
                    <div className="verticalNums__cont">
                        <div className="horizontalCont verticalNums">
                            <KeyboardBtn text="7" small gray />
                            <KeyboardBtn text="8" small gray />
                            <KeyboardBtn text="9" small gray />
                        </div>
                        <div className="horizontalCont verticalNums">
                            <KeyboardBtn text="4" small gray />
                            <KeyboardBtn text="5" small gray />
                            <KeyboardBtn text="6" small gray />
                        </div>
                        <div className="horizontalCont verticalNums">
                            <KeyboardBtn text="1" small />
                            <KeyboardBtn text="2" small />
                            <KeyboardBtn text="3" small />
                        </div>
                        <div className="horizontalCont verticalNums">
                            <span className="keyboardButton large-0">0</span>
                        </div>
                    </div>
                </div>
            </div>
            <p>
                pēc tam teksta lodziņā ievadiet spēlētāja numuru, kurš iemeta
                bumbu grozā.
            </p>
        </div>
    );
}
