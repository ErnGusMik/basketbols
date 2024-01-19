import React from "react";
import "./new-tournament-3.css";
import Progress from "../../../../components/progress/progress";
import Button from "../../../../components/button/button";
import Table from "../../../../components/tables/tables";
import RadioInput from "../../../../components/radio-input/input";
import TextInput from "../../../../components/text-input/input";
import SubmitInput from "../../../../components/submit-input/input";
import { useNavigate } from "react-router-dom";

import logoImg from "../../../../main.jpg";

export default function NewTournament3() {
    // Set title & required vars
    document.title = "Solis 3 | Jauns turnīrs | Gandrīz NBA";
    const navigate = useNavigate();

    // Set states
    const [logo, setLogo] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [refereeNameError, setRefereeNameError] = React.useState(false);
    const [refereePlayoffsError, setRefereePlayoffsError] =
        React.useState(false);
    const [tableContent, setTableContent] = React.useState([]);

    // Get data from local storage
    const getData = () => {
        const parsedData = JSON.parse(localStorage.getItem("tournament"));
        const tournamentLogo = localStorage.getItem("tournamentLogo");

        if (
            tournamentLogo &&
            !tournamentLogo === "data:application/octet-stream;base64,"
        ) {
            setLogo(tournamentLogo);
        } else {
            setLogo(logoImg);
        }

        if (!parsedData) {
            navigate("/app/tournaments/new");
        }

        switch (parsedData.finalsNum) {
            case "16":
                parsedData.finalsNum = "Astotdaļfināli";
                break;
            case "8":
                parsedData.finalsNum = "Ceturtdaļfināli";
                break;
            case "4":
                parsedData.finalsNum = "Pusfināli";
                break;
            case "2":
                parsedData.finalsNum = "Fināls";
                break;
            default:
                parsedData.finalsNum = 0;
                break;
        }

        return parsedData;
    };

    // Set data
    React.useEffect(() => {
        setData(getData());
        setTable();
    }, []);

    // Onclick function for adding referee
    const addReferee = () => {
        setRefereeNameError(false);
        setRefereePlayoffsError(false);

        document.getElementById("addRefereeForm").reset();

        const overlay = document.getElementById("overlay3");
        const addRef = document.getElementById("addReferee");
        addRef.classList.remove("close");
        addRef.classList.add("active");
        overlay.style = "display: block; opacity: 1;";
    };

    // Onclick function for canceling adding referee
    const cancelReferee = () => {
        const overlay = document.getElementById("overlay3");
        const addRef = document.getElementById("addReferee");
        addRef.classList.remove("active");
        addRef.classList.add("close");
        overlay.style = "display: none; opacity: 0;";
    };

    // Onclick function for submitting referee
    const submitReferee = (e) => {
        e.preventDefault();

        const form = new FormData(e.target);
        const data = Object.fromEntries(form.entries());

        const refereeName = data.refereeName;
        let refereePlayoffs = data.refereePlayoffs;

        if (refereePlayoffs === "Jā") {
            refereePlayoffs = true;
        } else {
            refereePlayoffs = false;
        }

        const savedData = JSON.parse(localStorage.getItem("referees"));

        if (savedData) {
            let nameIncluded = false;
            savedData.forEach((referee) => {
                if (referee[0] === refereeName) {
                    nameIncluded = true;
                }
            });
            if (nameIncluded) {
                setRefereeNameError(" ir jau pievienots!");
                return;
            }
            savedData.push([refereeName, refereePlayoffs]);
            localStorage.setItem("referees", JSON.stringify(savedData));
        } else {
            localStorage.setItem(
                "referees",
                JSON.stringify([[refereeName, refereePlayoffs]])
            );
        }

        const overlay = document.getElementById("overlay3");
        const addRef = document.getElementById("addReferee");

        setTable();

        addRef.classList.add("close");
        addRef.classList.remove("active");
        overlay.style = "display: none; opacity: 0;";
    };

    // Table function for setting playoff status
    const setTable = () => {
        const savedData = JSON.parse(localStorage.getItem("referees"));
        if (!savedData) {
            setTableContent([]);
        }
        let output = [];
        savedData.forEach((referee) => {
            output.push([
                referee[0],
                referee[1] ? (
                    <span className="refereeOuter">
                        <span className="refereeInner"></span>
                    </span>
                ) : (
                    <span className="refereeOuter"></span>
                ),
            ]);
        });
        setTableContent(output);
    };

    return (
        <div className="new-tournament-3__container">
            <div className="new-tournament-3">
                <div className="flexCont">
                    <Progress progress={3} />
                    <Button
                        text="Pievienot tiesnesi"
                        icon={<i className="fa-solid fa-plus"></i>}
                        onClick={addReferee}
                    />
                    <div className="table__container">
                        <Table
                            cols={["Vārds", "Izslēgšanas spēles"]}
                            setColWidth="300px"
                            content={tableContent}
                        />
                        <p>
                            Izvēlies kuri tiesneši drīkstēs tiesāt izslēgšanas
                            spēles.
                            <br />
                            <br />
                            Ja neizvēlēsies nevienu, tie tiks automātiski
                            salikti.
                        </p>
                    </div>
                </div>
                <form className="tournamentInfo__container">
                    <div className="tournamentInfo">
                        <div className="fileInput-image img-center">
                            <img src={logo} alt="Turnīra logo" />
                        </div>
                        <div>
                            <h2>{data.name ? data.name : ""}</h2>
                            <p>
                                {data.groupNum ? data.groupNum : "0"} grupas,{" "}
                                {data.teamNum ? data.teamNum : "0"} komandas
                            </p>
                            <p>{data.finalsNum ? data.finalsNum : ""}</p>
                        </div>
                        <div className="refereeNum__container">
                            <RadioInput
                                label="Tiesnešu # kas tiesās vienu spēli"
                                inputID="refereeNum"
                                value={["2", "3", "4"]}
                                centered={true}
                                required={true}
                            />
                        </div>
                    </div>
                    <div className="submitCont">
                        <SubmitInput
                            value="Turpināt"
                            backValue="Atpakaļ"
                            inputID="continueFrom3"
                            backInputID="backFrom3"
                            includeBack={true}
                            onBackClick={() => {
                                navigate("/app/tournaments/new/2");
                            }}
                            onClick={(e) => {
                                e.preventDefault();

                                if (e.target.form.checkValidity()) {

                                    // get refereeNum
                                    const form = new FormData(e.target.form);
                                    const data = Object.fromEntries(
                                        form.entries()
                                    );
                                    const refereeNum = data.refereeNum;

                                    localStorage.setItem(
                                        "refereeNum",
                                        refereeNum
                                    );

                                    navigate("/app/tournaments/new/4");
                                    return;
                                }
                            }}
                        />
                    </div>
                </form>
            </div>
            <div className="overlay" id="overlay3"></div>
            <div className="addTeam" id="addReferee">
                <form
                    className="addTeamForm"
                    id="addRefereeForm"
                    onSubmit={submitReferee}
                >
                    <h1>Pievienot tiesnesi</h1>
                    <TextInput
                        label="Tiesneša pilnais vārds"
                        placeholder="Gatis Saliņš"
                        required={true}
                        inputID="refereeName"
                        error={refereeNameError}
                    />
                    <RadioInput
                        inputID="refereePlayoffs"
                        label="Vai tiesnesim atļauts tiesāt izslēgšanas spēles?"
                        labelSub="Tiesnešiem tiks automātiski iedalītas spēles, ko tiesāt"
                        value={["Jā", "Nē"]}
                        required={true}
                        error={refereePlayoffsError}
                    />
                    <div className="teamSubmitCont">
                        <SubmitInput
                            value="Pievienot"
                            backValue="Atcelt"
                            inputID="addRefereeSubmit"
                            backInputID="addRefereeCancel"
                            includeBack={true}
                            onBackClick={cancelReferee}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
