import React from "react";
import { useNavigate } from "react-router-dom";
import Progress from "../../../../components/progress/progress";

import logoImg from "./../../../../main.jpg";

export default function NewTournament4() {
  // Set title and required vars
  document.title = "Solis 4 | Jauns turnīrs | Gandrīz NBA";
  const navigate = useNavigate();

  // Set states
  const [tournament, setTournament] = React.useState([]);
  const [teams, setTeams] = React.useState([]);
  const [referees, setReferees] = React.useState([]);
  const [logo, setLogo] = React.useState("");

  // Get data from localStorage
  const getData = () => {
    const tournamentData = JSON.parse(localStorage.getItem("tournament"));
    const teamData = JSON.parse(localStorage.getItem("teams"));
    const refereeData = JSON.parse(localStorage.getItem("referees"));
    const tournamentLogo = localStorage.getItem("logo");

    if (!tournamentData || !teamData || !refereeData) {
      navigate("/app/tournaments/new");
    }

    if (tournamentLogo !== "data:application/octet-stream;base64,") {
      setLogo(tournamentLogo);
    }

    setTournament(tournamentData);
    setTeams(teamData);
    setReferees(refereeData);
    return;
  };

  // Run getData on page load
  React.useEffect(() => {
    getData();
  }, []);

  return (
    <div className="new-tournament-4__container">
      <div className="new-tournament-4">
        <div className="flexCont">
          <Progress progress={4} />
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
              value="Izveidot"
              backValue="Atpakaļ"
              inputID="continueFrom4"
              backInputID="backFrom4"
              includeBack={true}
              onBackClick={() => {
                navigate("/app/tournaments/new/3");
              }}
              onClick={(e) => {
                e.preventDefault();
                navigate("/app/tournaments/new/send");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
