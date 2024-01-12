import React from "react";
import "./new-tournament-3.css";
import Progress from "../../../../components/progress/progress";
import Button from "../../../../components/button/button";
import Table from "../../../../components/tables/tables";
import RadioInput from "../../../../components/radio-input/input";
import Table from "../../../../components/tables/tables";
import { useNavigate } from "react-router-dom";

import logoImg from "../../../../main.jpg";

export default function NewTournament3() {
  // Set title & required vars
  document.title = "Solis 3 | Jauns turnīrs | Gandrīz NBA";
  const navigate = useNavigate();

  // Set states
  const [logo, setLogo] = React.useState(false);

  return (
    <div className="new-tournament-3__container">
      <div className="new-tournament-3">
        <div className="flexCont">
          <Progress progress={3} />
          <Button
            text="Pievienot tiesnesi"
            icon={<i className="fa-solid fa-plus"></i>}
          />
          <div className="table__container">
            <Table
              cols={["Vārds", "Izslēgšanas spēles"]}
              setColWidth="300px"
              id="refereeTable"
              content={[]}
            />
            <p>
              Izvēlies kuri tiesneši drīkstēs tiesāt izslēgšanas spēles.
              <br />
              Ja neizvēlēsies nevienu, tie tiks automātiski salikti.
            </p>
          </div>
        </div>
        <div className="tournamentInfo__container">
          <div className="tournamentInfo">
            <div className="fileInput-image img-center">
              <img src={logo ? logo : logoImg} alt="Turnīra logo" />
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
              inputID="continueFrom3"
              backInputID="backFrom3"
              includeBack={true}
              onBackClick={() => {
                navigate("/app/tournaments/new/2");
              }}
            />
          </div>
        </div>
      </div>
      <div className="overlay" id="newTournament3Overlay"></div>
      <div className="addTeam" id="addReferee">
        <form className="addTeamForm" onSubmit={submitTeam} id="addReferee">
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
