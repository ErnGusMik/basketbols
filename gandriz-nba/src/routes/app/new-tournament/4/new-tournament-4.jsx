// TODO: Make sure times change correctly with games
// TODO: Make sure only each groups' games are shown in each table

import React from "react";
import { useNavigate } from "react-router-dom";
import Progress from "../../../../components/progress/progress";
import SubmitInput from "../../../../components/submit-input/input";
import Table from "../../../../components/tables/tables";

import "./new-tournament-4.css";
import logoImg from "./../../../../main.jpg";

export default function NewTournament4() {
  // Set title and required vars
  document.title = "Solis 4 | Jauns turnīrs | Gandrīz NBA";
  const navigate = useNavigate();
  const dateOptions = { day: "2-digit", month: "2-digit", year: "2-digit" };
  const timeOptions = { hour: "2-digit", minute: "2-digit" };
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 6);
  defaultDate.setHours(20, 30, 0, 0);

  // Set states
  const [tournament, setTournament] = React.useState([]);
  const [teams, setTeams] = React.useState([]);
  const [referees, setReferees] = React.useState([]);
  const [refereeNum, setRefereeNum] = React.useState(0);
  const [logo, setLogo] = React.useState("");
  const [finals, setFinals] = React.useState(0);
  const [groups, setGroups] = React.useState([]);
  const [gameSchedule, setGameSchedule] = React.useState([]);
  const [gameScheduleReady, setGameScheduleReady] = React.useState([]);
  const [lastDate, setLastDate] = React.useState(defaultDate);

  const setGroupNum = (num) => {
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

  // Get data from localStorage
  const getData = () => {
    const tournamentData = JSON.parse(localStorage.getItem("tournament"));
    const teamData = JSON.parse(localStorage.getItem("teams"));
    const refereeData = JSON.parse(localStorage.getItem("referees"));
    const tournamentLogo = localStorage.getItem("logo");
    const refereeNum = localStorage.getItem("refereeNum");

    if (!tournamentData || !teamData || !refereeData) {
      navigate("/app/tournaments/new");
    }

    if (tournamentLogo !== "data:application/octet-stream;base64,") {
      setLogo(tournamentLogo);
    }

    refereeData.forEach((referee) => {
      referee.push(0);
    });

    switch (tournamentData.finalsNum) {
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

    setTournament(tournamentData);
    setTeams(teamData);
    setReferees(refereeData);
    setRefereeNum(refereeNum);
    setGroups(setGroupNum(tournamentData.groupNum));
    return;
  };

  // Run getData on page load
  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    readyGameSchedule();
  }, [referees]);

  // Sets & prepares game times
  const getNextGameTime = () => {
    const date = lastDate;

    if (date.getHours() === 18) {
      date.setHours(20, 30, 0, 0);
      setLastDate(date);
      return date;
    } else if (date.getHours() === 20) {
      date.setDate(date.getDate() + 1);
      date.setHours(18, 0, 0, 0);
      setLastDate(date);
      return date;
    } else {
      date.setDate(date.getDate() + 1);
      date.setHours(18, 0, 0, 0);
      setLastDate(date);
      return date;
    }
  };

  // Evenly split games between referees
  const splitRefereeGames = () => {
    const sortedReferees = referees.sort((a, b) => a[2] - b[2]);
    const selectedReferees = sortedReferees.slice(0, refereeNum);

    return selectedReferees;
  };

  // Create game schedule and save to state
  const createGameSchedule = () => {
    setGameSchedule([]);

    const groupedTeams = Object.groupBy(teams, (team) => team[3]);

    for (let i = 0; i < Object.keys(groupedTeams).length; i++) {
      const group = groupedTeams[i];
      const games = [];

      for (let j = 0; j < group.length; j++) {
        for (let k = 0; k < group.length; k++) {
          if (j !== k) {
            // check if game already exists
            const gameExists = games.find((game) => {
              return (
                (game.team1 === group[j][0] && game.team2 === group[k][0]) ||
                (game.team1 === group[k][0] && game.team2 === group[j][0])
              );
            });

            if (gameExists) continue;

            const time = getNextGameTime();
            const referees = splitRefereeGames();

            games.push({
              team1: group[j][0],
              team2: group[k][0],
              date: time,
              time: time,
              referees: referees.map((referee) => referee[0]).join(", "),
              venue: tournament.location,
              group: i,
            });
          }
        }
      }
      gameSchedule.push(games);
    }
    return gameSchedule;
  };

  // Ready game schedule for table
  const readyGameSchedule = () => {
    const schedule = createGameSchedule();

    const readySchedule = [];

    schedule.forEach((group) => {
      group.forEach((game) => {
        readySchedule.push([
          game.team1,
          game.team2,
          game.date.toLocaleDateString("lv-LV", dateOptions),
          game.time.toLocaleTimeString("lv-LV", timeOptions),
          game.referees,
          game.venue,
        ]);
      });
    });

    setGameScheduleReady(readySchedule);
  };

  return (
    <div className="new-tournament-4__container">
      <div className="new-tournament-4">
        <div className="flexCont">
          <Progress progress={4} />

          <p className="groupLinks" id="groupLinks">
            {groups.map((group, index) => {
              return (
                <a href={`#gameTable-${group}`} className="groupLink">
                  <b>{group}</b> grupa
                </a>
              );
            })}
          </p>

          {groups.map((group, index) => {
            return (
              <div className={"gameTable-" + group} id={"gameTable-" + group}>
                <p className="tableLabel">
                  <b>{group}</b> grupa
                </p>
                <Table
                  cols={[
                    "Komanda",
                    "Komanda",
                    "Datums",
                    "Laiks",
                    "Tiesneši",
                    "Vieta",
                  ]}
                  id={"gameTable" + group}
                  content={
                    localStorage.getItem("referees") ? gameScheduleReady : []
                  }
                />
              </div>
            );
          })}
        </div>
        <div className="tournamentInfo__container">
          <div className="tournamentInfo">
            <div className="fileInput-image img-center">
              <img src={logo ? logo : logoImg} alt="Turnīra logo" />
            </div>

            <div>
              <h2>{tournament.name}</h2>
              <p>
                {tournament.groupNum} grupas, {tournament.teamNum} komandas
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
