import React from "react";
import { useNavigate } from "react-router-dom";

import "./new-tournament-2.css";
import Progress from "../../../../components/progress/progress";
import Button from "../../../../components/button/button";
import Table from "../../../../components/tables/tables";

import SubmitInput from "../../../../components/submit-input/input";
import TextInput from "../../../../components/text-input/input";

import logoImg from "./../../../../main.jpg";

export default function NewTournament2() {
    const cols = ["Nosaukums", "Spēlētāji"];
    document.title = "Solis 2 | Jauns turnīrs | Gandriz NBA";
    const navigate = useNavigate();

    const [teamNum, setTeamNum] = React.useState(0);
    const [addedTeamNum, setAddedTeamNum] = React.useState(
        JSON.parse(localStorage.getItem("teams"))
            ? JSON.parse(localStorage.getItem("teams")).length
            : 0
    );

    const [groupNum, setGroupNum] = React.useState([]);

    const [finals, setFinals] = React.useState(0);

    const [logo, setLogo] = React.useState(false);

    const [name, setName] = React.useState("");

    const [tableError, setTableError] = React.useState("");

    const [teamsInGroups, setTeamsInGroups] = React.useState([]);

    const setGroups = (num) => {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        if (num > alphabet.length) {
            let i = 0;
            let iterations = 1;
            let groups = [];
            while (i < num) {
                groups.push(iterations + alphabet[i]);
                if (i === alphabet.length - 1) {
                    i = 0;
                    iterations++;
                }
                i++;
            }
            return groups;
        }
        return alphabet.slice(0, num);
    };

    const getData = () => {
        const unparsedData = localStorage.getItem("tournament");
        const logo = localStorage.getItem("tournamentLogo");

        if (!unparsedData) {
            alert("Kaut kas nogāja greizi! (404 nav datu)");
            navigate("/app/tournaments/new");
            return [null, null];
        }

        const data = JSON.parse(unparsedData);

        return [data, logo];
    };

    React.useEffect(() => {
        const [data, logoData] = getData();
        if (data == [null, null]) return;
        setTeamNum(data.teamNum);
        setGroupNum(setGroups(data.groupNum));
        // How many teams in each group
        const teamsInGroupsDefault = Array(Number(data.groupNum)).fill(0);
        setTeamsInGroups(teamsInGroupsDefault);
        setName(data.name);
        switch (data.finalsNum) {
            case "16":
                setFinals("Astotdaļfināli");
                break;
            case "8":
                setFinals("Ceturtdaļfināli");
                break;
            case "4":
                setFinals("Pusfināli");
                break;
            case "2":
                setFinals("Fināls");
                break;
            default:
                setFinals(0);
                break;
        }
        if (logoData === "data:application/octet-stream;base64,") {
            setLogo(false);
        } else {
            setLogo(true);
        }
    }, []);

    const inputName = (
        <input
            placeholder="Vārds"
            type="text"
            defaultValue=""
            name="firstName"
        />
    );
    const inputSurname = (
        <input
            placeholder="Uzvārds"
            type="text"
            name="surname"
            defaultValue=""
        />
    );
    const inputNumber = (
        <input
            placeholder="Nr."
            type="number"
            min="0"
            name="number"
            defaultValue=""
        />
    );

    const [playerNum, setPlayerNum] = React.useState([
        [inputName, inputSurname, inputNumber],
        [inputName, inputSurname, inputNumber],
        [inputName, inputSurname, inputNumber],
        [inputName, inputSurname, inputNumber],
        [inputName, inputSurname, inputNumber],
    ]);

    // Pievienot komandu poga
    const addTeam = () => {
        const overlay = document.getElementById("overlay");
        const addTeam = document.getElementById("addTeam");
        addTeam.classList.remove("close");
        addTeam.classList.add("active");
        overlay.style = "display: block; opacity: 1;";
    };

    // Pievienot rindu poga
    const addPlayer = (e) => {
        e.preventDefault();
        setPlayerNum([...playerNum, [inputName, inputSurname, inputNumber]]);
    };

    // Atcelt poga komandas pievienošanai
    const cancelTeam = (e) => {
        e.preventDefault();
        const overlay = document.getElementById("overlay");
        const addTeam = document.getElementById("addTeam");
        addTeam.classList.remove("active");
        overlay.style = "display: none; opacity: 0;";
        setPlayerNum([
            [inputName, inputSurname, inputNumber],
            [inputName, inputSurname, inputNumber],
            [inputName, inputSurname, inputNumber],
            [inputName, inputSurname, inputNumber],
            [inputName, inputSurname, inputNumber],
        ]);
        document.getElementById("addTeamForm").reset();
    };

    // Pievienot komandas pievienošanas poga
    // Error handling
    const [teamNameError, setTeamNameError] = React.useState(false);
    const [headCoachError, setHeadCoachError] = React.useState(false);

    const submitTeam = (e) => {
        e.preventDefault();

        // extract values from inputs
        const teamName = document.getElementById("teamName").value;
        const headCoach = document.getElementById("headCoach").value;
        // Get players
        const players = [];
        let error = false;
        const table = document.getElementById("addTeamTable");
        // Loop through rows of table
        for (let i = 1; i < table.rows.length; i++) {
            const player = [];
            // Loop through cells of row
            for (let j = 0; j < table.rows[i].cells.length; j++) {
                // Push value of input to player array
                player.push(table.rows[i].cells[j].children[0].value);
            }
            player[2] = parseInt(player[2]);
            players.push(player);
        }

        // Check if all inputs are filled
        if (!teamName) {
            setTeamNameError("nedrīkst būt tukšs!");
            return;
        } else {
            setTeamNameError(false);
        }
        if (!headCoach) {
            setHeadCoachError("nedrīkst būt tukšs!");
            return;
        } else {
            setHeadCoachError(false);
        }

        let numbers = [];
        for (let i = 0; i < 5; i++) {
            if (
                !players[i][0] ||
                !players[i][1] ||
                (!players[i][2] && players[i][2])
            ) {
                setTableError("Katrai komandai vajag vismaz 5 spēlētājus!");
                error = true;
                break;
            }
        }

        for (let i = 0; i < players.length; i++) {
            if (!Number.isInteger(players[i][2]) && players[i][2]) {
                setTableError("Spēlētāja numuriem jābūt veseliem skaitļiem!");
                error = true;
                break;
            }
            if (numbers.includes(players[i][2]) && players[i][2]) {
                setTableError("Spēlētāju numuri nedrīkst būt vienādi!");
                error = true;
                break;
            } else {
                numbers.push(players[i][2]);
            }
        }

        if (error) {
            return;
        } else {
            setTableError("");
        }

        // check if array has empty rows and remove them
        players.filter((element) => element.join("") != "");

        // Get teams from local storage
        const teams = JSON.parse(localStorage.getItem("teams"));

        const teamsInGroupsDefault = Array(Number(groupNum.length)).fill(0);
        setTeamsInGroups(teamsInGroupsDefault);

        // check how many teams are in each group
        if (teams) {
            for (let i = 0; i < teams.length; i++) {
                teamsInGroups[teams[i][3]]++;
            }
        }

        const team = [teamName, headCoach, players];

        // check if team exists and replace it if it does
        let teamExists = false;
        if (teams) {
            for (let i = 0; i < teams.length; i++) {
                if (teams[i][0] === teamName) {
                    teamExists = true;
                    teams[i][0] = team[0];
                    teams[i][1] = team[1];
                    teams[i][2] = team[2];
                    team[3] = teams[i][3];
                    break;
                }
            }
        }

        // if team doesn't exist, add it to a random group
        if (!teamExists) {
            let group = Math.floor(Math.random() * groupNum.length);
            while (teamsInGroups[group] >= teamNum / groupNum.length) {
                group = Math.floor(Math.random() * groupNum.length);
            }

            team.push(group);
        }

        // add team to local storage
        if (teams) {
            if (addedTeamNum >= teamNum) {
                return;
            }
            if (!teamExists) {
                teams.push(team);
            }
            localStorage.setItem("teams", JSON.stringify(teams));
        } else {
            localStorage.setItem("teams", JSON.stringify([team]));
        }

        // remove popup
        const overlay = document.getElementById("overlay");
        const addTeam = document.getElementById("addTeam");
        addTeam.classList.remove("active");
        overlay.style = "display: none; opacity: 0;";
        // reset table & form
        setPlayerNum([
            [inputName, inputSurname, inputNumber],
            [inputName, inputSurname, inputNumber],
            [inputName, inputSurname, inputNumber],
            [inputName, inputSurname, inputNumber],
            [inputName, inputSurname, inputNumber],
        ]);
        e.target.reset();
        setAddedTeamNum(JSON.parse(localStorage.getItem("teams")).length);
    };

    // sets table content
    const setTeamTables = (index) => {
        const result = [];
        const teams = JSON.parse(localStorage.getItem("teams"));
        for (let i = 0; i < teams.length; i++) {
            if (index === teams[i][3]) {
                result.push([
                    teams[i][0],
                    <a
                        href="#"
                        id={"team-" + teams[i][0]}
                        onClick={function (e) {
                            e.preventDefault();
                            const team = JSON.parse(
                                localStorage.getItem("teams")
                            ).filter((team) => team[0] == teams[i][0])[0];
                            document.getElementById("teamName").value = team[0];
                            document.getElementById("headCoach").value =
                                team[1];
                            setPlayerNum(
                                team[2].map((player) => {
                                    return [
                                        <input
                                            placeholder="Vārds"
                                            type="text"
                                            defaultValue={player[0]}
                                            name="firstName"
                                        />,
                                        <input
                                            placeholder="Uzvārds"
                                            type="text"
                                            defaultValue={player[1]}
                                            name="surname"
                                        />,
                                        <input
                                            placeholder="Nr."
                                            type="number"
                                            min="0"
                                            defaultValue={player[2]}
                                            name="number"
                                        />,
                                    ];
                                })
                            );
                            addTeam();
                        }}
                    >
                        skatīt
                    </a>,
                ]);
            }
        }
        return result;
    };

    return (
        <div className="new-tournament-2__container">
            <div className="new-tournament-2">
                <div className="flexCont">
                    <Progress progress={2} />
                    <Button
                        text="Pievienot komandu"
                        icon={<i className="fa-solid fa-plus" />}
                        onClick={addTeam}
                        disabled={addedTeamNum >= teamNum}
                    />
                    <p className="teamNum">
                        Komandas{" "}
                        <b>
                            {addedTeamNum}/{teamNum}
                        </b>
                    </p>
                    <p className="groupLinks" id="groupLinks">
                        {groupNum.map((group, index) => {
                            return (
                                <a href={`#${group}`} className="groupLink">
                                    <b>{group}</b> grupa
                                </a>
                            );
                        })}
                    </p>
                    {groupNum.map((group, index) => {
                        return (
                            <div className="tableGroup" id={group}>
                                <p className="tableLabel">
                                    <b>{group}</b> grupa
                                </p>
                                <Table
                                    cols={cols}
                                    content={
                                        JSON.parse(
                                            localStorage.getItem("teams")
                                        )
                                            ? setTeamTables(index)
                                            : []
                                    }
                                    setColWidth="300px"
                                />
                            </div>
                        );
                    })}
                </div>
                <div className="tournamentInfo__container">
                    <div className="tournamentInfo">
                        <div className="fileInput-image img-center">
                            <img
                                src={logo ? logo : logoImg}
                                alt="Turnīra logo"
                            />
                        </div>
                        <div>
                            <h2>{name}</h2>
                            <p>
                                {groupNum.length} grupas, {teamNum} komandas
                            </p>
                            <p>{finals ? finals : ""}</p>
                        </div>
                    </div>
                    <div className="submitCont">
                        <SubmitInput
                            value="Turpināt"
                            backValue="Atpakaļ"
                            inputID="continueFrom2"
                            backInputID="backFrom2"
                            includeBack={true}
                            onBackClick={() => {
                                navigate("/app/tournaments/new");
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/app/tournaments/new/3");
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="overlay" id="overlay" />
            <div className="addTeam" id="addTeam">
                <form
                    className="addTeamForm"
                    onSubmit={submitTeam}
                    id="addTeamForm"
                >
                    <h1>Pievienot komandu</h1>
                    <TextInput
                        label="Komandas nosaukums"
                        placeholder="Čempionu komanda!"
                        required={true}
                        inputID="teamName"
                        error={teamNameError}
                    />
                    <Table
                        cols={["Vārds", "Uzvārds", "Nr."]}
                        content={playerNum}
                        setColWidth="150px"
                        id="addTeamTable"
                    />
                    <div className="buttonCont">
                        <Button
                            text="Pievienot rindu"
                            icon={<i className="fa-solid fa-plus" />}
                            onClick={addPlayer}
                        />
                        <p className="tableError">{tableError}</p>
                    </div>
                    <TextInput
                        placeholder="Luka Banki"
                        label="Galvenais treneris"
                        required={true}
                        inputID="headCoach"
                        error={headCoachError}
                    />
                    <div className="teamSubmitCont">
                        <SubmitInput
                            value="Pievienot"
                            backValue="Atcelt"
                            inputID="addTeamSubmit"
                            backInputID="addTeamCancel"
                            includeBack={true}
                            onBackClick={cancelTeam}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
