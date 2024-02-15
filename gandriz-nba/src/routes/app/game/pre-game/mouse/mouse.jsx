import React from "react";
import Button from "./../../../../../components/button/button";
import KeyboardBtn from "../../../../../components/tournament-pages/keyboard/keyboard-button";

import "./mouse.css";

export default function Mouse() {
    return (
        <div className="mouse__container">
            <div className="points horizontalCont verticalStart">
                <div className="flexCont">
                    <h2>Čempionu komanda!</h2>
                    <div className="horizontalCont center mainBtns">
                        <KeyboardBtn text="1" caption="+1 punkts" />
                        <KeyboardBtn text="2" caption="+2 punkti" />
                        <KeyboardBtn text="3" caption="+3 punkti" />
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
                </div>
            </div>
            <p>
                pēc tam lodziņā uzkliksķiniet uz spēlētāja numura, kurš iemeta
                bumbu grozā.
            </p>
            <div className="points horizontalCont verticalStart">
                <div className="flexCont horizontalCont verticalStart mainBtns">
                    <KeyboardBtn
                        text={<i class="fa-solid fa-circle-xmark"></i>}
                        caption="+1 piezīme"
                    />
                    <KeyboardBtn
                        text={<i class="fa-solid fa-shield"></i>}
                        caption="+1 bloks"
                    />
                    <KeyboardBtn
                        text={<i class="fa-solid fa-hourglass-start"></i>}
                        caption="+1 min pārtraukums"
                    />
                </div>
                <p style={{ maxWidth: "150px" }}>
                    Kad nepieciešams, izvēlieties spēlētāja numuru lodziņā.
                </p>
                <div className="flexCont horizontalCont verticalStart mainBtns">
                    <KeyboardBtn
                        text={<i class="fa-solid fa-circle-xmark"></i>}
                        caption="+1 piezīme"
                    />
                    <KeyboardBtn
                        text={<i class="fa-solid fa-shield"></i>}
                        caption="+1 bloks"
                    />
                    <KeyboardBtn
                        text={<i class="fa-solid fa-hourglass-start"></i>}
                        caption="+1 min pārtraukums"
                    />
                </div>
            </div>
            <div className="horizontalCont verticalStart center mainBtns">
                <KeyboardBtn text="24" caption="24s" />
                <KeyboardBtn text="14" caption="14s" />
            </div>
            <div className="spaceBtn__cont">
                <span className="spaceBtn">
                <i class="fa-solid fa-play"></i>
                <p>/</p>
                <i class="fa-solid fa-pause"></i>
                </span>
                <p>Pauzēt/turpināt laika atskaiti</p>
            </div>
            <div className="keyboard__readyBtn">
                <Button text="Gatavs" />
            </div>
        </div>
    );
}
