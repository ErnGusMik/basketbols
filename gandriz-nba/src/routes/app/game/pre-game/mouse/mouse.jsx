import React from "react";
import Button from "./../../../../../components/button/button";
import KeyboardBtn from "../../../../../components/tournament-pages/keyboard/keyboard-button";

import "./mouse.css";
import { useNavigate, useParams } from "react-router-dom";

export default function Mouse() {
    const navigate = useNavigate();
    const { id } = useParams();
    return (
        <div className="mouse__container keyboard__container">
            <div className="points horizontalCont verticalStart">
                <div className="flexCont">
                    <h2>Čempionu komanda!</h2>
                    <div className="horizontalCont center mainBtns">
                        <KeyboardBtn pointer text="1" caption="+1 punkts" />
                        <KeyboardBtn pointer text="2" caption="+2 punkti" />
                        <KeyboardBtn pointer text="3" caption="+3 punkti" />
                    </div>
                </div>
                <div className="flexCont horizontalCont">
                    <div>
                        <h2>Ceturtās klases vilki</h2>
                        <div
                            className="horizontalCont center mainBtns"
                            id="pointsInstruction2"
                        >
                            <KeyboardBtn pointer text="1" caption="+1 punkts" />
                            <KeyboardBtn pointer text="2" caption="+2 punkti" />
                            <KeyboardBtn pointer text="3" caption="+3 punkti" />
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
                        pointer
                        text={<i class="fa-solid fa-circle-xmark" />}
                        caption="+1 piezīme"
                    />
                    <KeyboardBtn
                        pointer
                        text={<i class="fa-solid fa-shield" />}
                        caption="+1 bloks"
                    />
                    <KeyboardBtn
                        pointer
                        text={<i class="fa-solid fa-hourglass-start" />}
                        caption="+1 min pārtraukums"
                    />
                </div>
                <p style={{ maxWidth: "150px" }}>
                    Kad nepieciešams, izvēlieties spēlētāja numuru lodziņā.
                </p>
                <div className="flexCont horizontalCont verticalStart mainBtns">
                    <KeyboardBtn
                        pointer
                        text={<i class="fa-solid fa-circle-xmark" />}
                        caption="+1 piezīme"
                    />
                    <KeyboardBtn
                        pointer
                        text={<i class="fa-solid fa-shield" />}
                        caption="+1 bloks"
                    />
                    <KeyboardBtn
                        pointer
                        text={<i class="fa-solid fa-hourglass-start" />}
                        caption="+1 min pārtraukums"
                    />
                </div>
            </div>
            <div className="horizontalCont verticalStart center mainBtns">
                <KeyboardBtn pointer text="24" caption="24s" />
                <KeyboardBtn pointer text="14" caption="14s" />
            </div>
            <div className="spaceBtn__cont">
                <span className="spaceBtn">
                    <i class="fa-solid fa-play" />
                    <p>/</p>
                    <i class="fa-solid fa-pause" />
                </span>
                <p>Pauzēt/turpināt laika atskaiti</p>
            </div>
            <div className="keyboard__readyBtn">
                <Button
                    text="Gatavs"
                    onClick={() => {
                        navigate("/game/" + id + "/play");
                    }}
                />
            </div>
        </div>
    );
}
