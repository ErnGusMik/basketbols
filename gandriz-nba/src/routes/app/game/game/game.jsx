// TODO: Get teams from server, display data, add functionality to buttons, send to server every 5s (?)
// ! No need to follow design exactly -- that is for public page. This is for admin page.
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import KeyboardBtn from "./../../../../components/tournament-pages/keyboard/keyboard-button";
import StartAnimation from "../../../../components/game/start-anim/start-anim";

import "./game.css";

export default function Game() {
    // Set states and title
    document.title = "Admin | NULL vs NULL | Gandrīz NBA";
    const navigate = useNavigate();
    const params = useParams();
    const [gameData, setGameData] = React.useState(null);
    const [instructions, setInstructions] = React.useState(
        <p>Lūdzu, mazliet pagaidiet! Mēs lādējam spēles informāciju!</p>
    );
    const [disabled, setDisabled] = React.useState(true);

    // Get game data from the server
    const getGame = async () => {
        const { id } = params;
        const request = await fetch(`http://localhost:8080/api/games/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        const response = await request.json();

        if (response.error || response.length === 0) {
            navigate("/app/game/not-found");
            return;
        }

        setInstructions(
            <p>
                Lai sāktu 10s laika atskaiti līdz spēles sākumam, spied{" "}
                <i class="fa-solid fa-play"></i> vai atsarpes taustiņu.
            </p>
        );

        setDisabled(false);

        setGameData(response);
        console.log(response);
    };

    // Get teams data from the server
    const getTeams = async () => {

    };

    React.useEffect(() => {
        getGame();
    }, []);

    return (
        <div className="game__container">
            <StartAnimation start={false} />

            <div className="gameFlex__container">
                <div className="flexCont team">
                    <h2>Čempionu komanda!</h2>
                    <h1>126</h1>
                    <div className="btnCont">
                        <KeyboardBtn pointer text="+1" />
                        <KeyboardBtn pointer text="+2" />
                        <KeyboardBtn pointer text="+3" />
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
                            pointer
                            text={<i class="fa-solid fa-circle-xmark"></i>}
                        />
                        <KeyboardBtn
                            pointer
                            text={<i class="fa-solid fa-shield"></i>}
                        />
                        <KeyboardBtn
                            pointer
                            text={<i class="fa-solid fa-hourglass-start"></i>}
                        />
                    </div>
                </div>

                <div className="flexCont" id="adminGameInstructions">
                    <span
                        className={
                            disabled
                                ? "spaceBtn keyboardBtn disabled"
                                : "spaceBtn keyboardBtn"
                        }
                        id="gameSpaceBtn"
                    >
                        <i class="fa-solid fa-play fa-xl"></i>
                    </span>
                    {instructions}
                </div>

                <div className="flexCont team team-right">
                    <h2>Ogres SC</h2>
                    <h1>89</h1>
                    <div className="btnCont">
                        <KeyboardBtn pointer text="+1" />
                        <KeyboardBtn pointer text="+2" />
                        <KeyboardBtn pointer text="+3" />
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
                            pointer
                            text={<i class="fa-solid fa-circle-xmark"></i>}
                        />
                        <KeyboardBtn
                            pointer
                            text={<i class="fa-solid fa-shield"></i>}
                        />
                        <KeyboardBtn
                            pointer
                            text={<i class="fa-solid fa-hourglass-start"></i>}
                        />
                    </div>
                </div>
            </div>
            <div className="gameInfo">
                <h3>9:34</h3>
                <h4>
                    <b>Periods 4</b>
                </h4>
                <p>
                    <b style={{ fontWeight: 900 }}>A</b> grupa
                </p>
                <p>Skolas čempis 2024, Ogre</p>
            </div>
        </div>
    );
}
