// TODO: Build the game page (use all designs from the Figma file)
// ! No need to follow design exactly -- that is for public page. This is for admin page.
// TODO: Make use of components from the components folder (create them there for easier readability)
import React from "react";
import KeyboardBtn from "./../../../../components/tournament-pages/keyboard/keyboard-button";

import "./game.css";

export default function Game() {
    return (
        <div className="game__container">
            <div className="gameFlex__container">
                <div className="flexCont team">
                    <h2>Čempionu komanda!</h2>
                    <h1>126</h1>
                    <div className="btnCont">
                        <KeyboardBtn text="+1" />
                        <KeyboardBtn text="+2" />
                        <KeyboardBtn text="+3" />
                    </div>
                    <div className="foul__container">
                        <span className="foul active"></span>
                        <span className="foul active"></span>
                        <span className="foul"></span>
                        <span className="foul"></span>
                        <span className="foul"></span>
                    </div>
                    <div className="btnCont">
                        <KeyboardBtn
                            text={<i class="fa-solid fa-circle-xmark"></i>}
                        />
                        <KeyboardBtn
                            text={<i class="fa-solid fa-shield"></i>}
                        />
                        <KeyboardBtn
                            text={<i class="fa-solid fa-hourglass-start"></i>}
                        />
                    </div>
                </div>
                <div className="flexCont team">
                    <h2>Ogres SC</h2>
                    <h1>89</h1>
                    <div className="btnCont">
                        <KeyboardBtn text="+1" />
                        <KeyboardBtn text="+2" />
                        <KeyboardBtn text="+3" />
                    </div>
                    <div className="foul__container full">
                        <div className="foul active"></div>
                        <div className="foul active"></div>
                        <div className="foul active"></div>
                        <div className="foul active"></div>
                        <div className="foul"></div>
                    </div>
                    <div className="btnCont">
                        <KeyboardBtn
                            text={<i class="fa-solid fa-circle-xmark"></i>}
                        />
                        <KeyboardBtn
                            text={<i class="fa-solid fa-shield"></i>}
                        />
                        <KeyboardBtn
                            text={<i class="fa-solid fa-hourglass-start"></i>}
                        />
                    </div>
                </div>
            </div>
            <div className="gameInfo">
                <h3>9:34</h3>
                <p>
                    <b>Periods 4</b>
                </p>
                <br />
                <p>
                    <b>A</b> grupa
                </p>
                <p>Skolas čempis 2024, Ogre</p>
            </div>
        </div>
    );
}
