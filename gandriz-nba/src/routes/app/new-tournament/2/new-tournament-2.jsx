import React from "react";
import { Link } from "react-router-dom";

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

  const [teamNum, setTeamNum] = React.useState(0);
  const [addedTeamNum, setAddedTeamNum] = React.useState(0);

  const [groupNum, setGroupNum] = React.useState([]);

  const [finals, setFinals] = React.useState(0);

  const [logo, setLogo] = React.useState(false);

  const [name, setName] = React.useState("");

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
      return;
    }

    const data = JSON.parse(unparsedData);

    return [data, logo];
  };

  React.useEffect(() => {
    const [data, logoData] = getData();
    setTeamNum(data.teamNum);
    setGroupNum(setGroups(data.groupNum));
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

  const inputName = <input placeholder="Vārds" type="text" required />;
  const inputSurname = <input placeholder="Uzvārds" type="text" required />;
  const inputNumber = (
    <input placeholder="Nr." type="number" min="0" required />
  );

  return (
    <div className="new-tournament-2__container">
      <div className="new-tournament-2">
        <div className="flexCont">
          <Progress progress={2} />
          <Button
            text="Pievienot komandu"
            icon={<i className="fa-solid fa-plus"></i>}
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
                <Link to={`#${group}`} className="groupLink">
                  <b>{group}</b> grupa
                </Link>
              );
            })}
          </p>
          {groupNum.map((group, index) => {
            return (
              <div className="tableGroup" id={group}>
                <p className="tableLabel">
                  <b>{group}</b> grupa
                </p>
                <Table cols={cols} content={[]} setColWidth="300px" />
              </div>
            );
          })}
        </div>
        <div className="tournamentInfo__container">
          <div className="tournamentInfo">
            <div className="fileInput-image">
              <img src={logo ? logo : logoImg} alt="Turnīra logo" />
            </div>
            <h2>{name}</h2>
            <p>
              {groupNum.length} grupas {teamNum} komandas
            </p>
            <p>{finals ? finals : ""}</p>
          </div>
          <div className="submitCont">
            <SubmitInput
              value="Turpināt"
              backValue="Atpakaļ"
              inputID="continueFrom2"
              backInputID="backFrom2"
              includeBack={true}
            />
          </div>
        </div>
      </div>
      <div className="overlay"></div>
      {/* TODO: make visible on click. style. show overlay on click. */}
      <div className="addTeam">
        <form className="addTeamForm">
          <h1>Pievienot komandu</h1>
          <Table
            cols={["Vārds", "Uzvārds", "Nr."]}
            content={[
              [inputName, inputSurname, inputNumber],
              [inputName, inputSurname, inputNumber],
              [inputName, inputSurname, inputNumber],
              [inputName, inputSurname, inputNumber],
              [inputName, inputSurname, inputNumber],
            ]}
            setColWidth="150px"
          />
          <Button 
            text="Pievienot rindu"
            icon={<i className="fa-solid fa-plus"></i>}
          />
          <TextInput
            placeholder="Luka Banki"
            label="Galvenais Treneris"
            required={true}
            inputID="headCoach"
          />
        </form>
      </div>
    </div>
  );
}
