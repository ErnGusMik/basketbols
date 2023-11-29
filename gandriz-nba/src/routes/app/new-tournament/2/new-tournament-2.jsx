import React from "react";
import { Link } from "react-router-dom";

import "./new-tournament-2.css";
import Progress from "../../../../components/progress/progress";
import Button from "../../../../components/button/button";
import Table from "../../../../components/tables/tables";

export default function NewTournament2() {
  const cols = ["Nosaukums", "Spēlētāji"];

  const [teamNum, setTeamNum] = React.useState(0);
  const [addedTeamNum, setAddedTeamNum] = React.useState(0);

  const [groupNum, setGroupNum] = React.useState(0);

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
    }
  };

  const getData = () => {
    const unparsedData = localStorage.getItem("tournament");
    const logo = localStorage.getItem("tournamentLogo");

    if (!unparsedData) {
      alert("Kaut kas nogāja greizi! (404 nav datu)");
      return;
    }

    const data = JSON.parse(unparsedData);

    setTeamNum(data.teamNum);
    setGroupNum(setGroups(data.groupNum));
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <div className="new-tournament-2">
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
      <p className="groupLinks">
        {() => {
          for (let i = 0; i < groupNum; i++) {
            <Link to={`#${i}`} className="groupLink">
              <b>{i}</b> grupa
            </Link>;
          }
        }}
      </p>
      <div className="tableGroup">
        <p className="tableLabel">
          <b>A</b> grupa
        </p>
        <Table cols={cols} content={[]} />
      </div>
    </div>
  );
}
