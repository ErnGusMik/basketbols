import React from "react";
import { useNavigate } from "react-router-dom";
import Progress from "../../../../components/progress/progress";
import SubmitInput from "../../../../components/submit-input/input";
import Table from "../../../../components/tables/tables";

import "./new-tournament-4.css";
import logoImg from "./../../../../main.jpg";

export default function NewTournament4() {
  const [lang, setLang] = React.useState(Boolean(localStorage.getItem("lang")));

  React.useEffect(() => {
    window.addEventListener("storage", () => {
      setLang(Boolean(localStorage.getItem("lang")));
    });

    return () => {
      window.removeEventListener("storage", () => {
        setLang(Boolean(localStorage.getItem("lang")));
      });
    };
  }, []);

  // Set title and required vars
  document.title = lang
    ? "Step 4 | New tournament | Gandriz NBA"
    : "Solis 4 | Jauns turnīrs | Gandrīz NBA";
  const navigate = useNavigate();
  const dateOptions = { day: "2-digit", month: "2-digit", year: "2-digit" };
  const timeOptions = { hour: "2-digit", minute: "2-digit" };

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
      return;
    }

    if (tournamentLogo !== "data:application/octet-stream;base64,") {
      setLogo(tournamentLogo);
    }

    refereeData.forEach((referee) => {
      referee.push(0);
    });

    switch (tournamentData.finalsNum) {
      case "16":
        setFinals(lang ? "Round of 16" : "Astotdaļfināli");
        break;
      case "8":
        setFinals(lang ? "Quarterfinals" : "Ceturtdaļfināli");
        break;
      case "4":
        setFinals(lang ? "Semi-finals" : "Pusfināli");
        break;
      case "2":
        setFinals(lang ? "Final" : "Fināls");
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
  const getNextGameTime = (date) => {
    if (date.getHours() === 18) {
      date.setHours(20, 30, 0, 0);
      return date;
    } else if (date.getHours() === 20) {
      date.setDate(date.getDate() + 1);
      date.setHours(18, 0, 0, 0);
      return date;
    } else {
      date.setDate(date.getDate() + 1);
      date.setHours(18, 0, 0, 0);
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

    let date = new Date();
    date.setDate(date.getDate() + 6);
    date.setHours(20, 30, 0, 0);

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

            date = getNextGameTime(date);
            const referees = splitRefereeGames();

            const game = {
              team1: group[j][0],
              team2: group[k][0],
              date: new Date(date).toJSON(),
              time: new Date(date).toJSON(),
              referees: referees.map((referee) => referee[0]).join(", "),
              venue: tournament.location,
              group: i,
            };

            games.push(game);
          }
        }
      }
      console.log(games);

      gameSchedule.push(games);
    }
    localStorage.setItem("gameSchedule", JSON.stringify(gameSchedule));
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
          <input
            className="invisibleInput"
            defaultValue={new Date(game.date).toLocaleDateString(
              "en-GB",
              dateOptions,
            )}
          />,
          <input
            className="invisibleInput"
            defaultValue={new Date(game.time).toLocaleTimeString(
              "en-GB",
              timeOptions,
            )}
          />,
          game.referees,
          <input className="invisibleInput" defaultValue={game.venue} />,
          groups[game.group],
        ]);
      });
    });

    setGameScheduleReady(readySchedule);
  };

  // Replace localStorage data with new data
  const submitData = (e) => {
    const container = document.getElementById("gameTableCont");
    const totalData = [];
    let dateError = false;

    for (let j = 0; j < container.children.length; j++) {
      const table = document.getElementById("gameTable-" + groups[j]);
      const tableRows = table.getElementsByTagName("tr");
      const tableData = [];
      for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i];
        const rowData = [];

        for (let j = 0; j < row.cells.length; j++) {
          const cell = row.cells[j];
          const input = cell.getElementsByTagName("input")[0];

          if (!input) continue;

          rowData.push(input.value);
        }

        if (rowData.length === 0) continue;

        try {
          const dateSplit = rowData[0].split("/");

          if (dateSplit.length !== 3 || dateSplit[1] > 12)
            throw new Error("Date error");

          const timeSplit = rowData[1].split(":");

          if (timeSplit.length !== 2 || Number(timeSplit[0]) > 60)
            throw new Error("Time error");

          const date = new Date(
            "20" + dateSplit[2],
            dateSplit[1] - 1,
            dateSplit[0],
            Number(timeSplit[0]),
            Number(timeSplit[1]),
          );

          rowData[0] = date;

          const time = new Date(
            "20" + dateSplit[2],
            dateSplit[1] - 1,
            dateSplit[0],
            Number(timeSplit[0]),
            Number(timeSplit[1]),
          );

          rowData[1] = time;
        } catch (error) {
          console.log(error);

          dateError = true;

          document.getElementById("tableError-" + groups[j]).innerHTML = lang
            ? "Date format: dd/mm/yy, time format: hh:mm"
            : "Datuma formāts: dd/mm/yy, laika formāts: hh:mm";
        }

        tableData.push(rowData);
      }
      totalData.push(tableData);
    }

    if (dateError) return false;

    const data = JSON.parse(localStorage.getItem("gameSchedule"));

    for (let i = 0; i < data.length; i++) {
      const updatedData = totalData[i];
      for (let j = 0; j < data[i].length; j++) {
        data[i][j].date = new Date(updatedData[j][0]).toJSON();
        data[i][j].time = new Date(updatedData[j][1]).toJSON();
        data[i][j].venue = updatedData[j][2];
      }
    }

    localStorage.setItem("gameSchedule", JSON.stringify(data));

    return true;
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
                  <b>{group}</b> {lang ? "group" : "grupa"}
                </a>
              );
            })}
          </p>
          <div id="gameTableCont">
            {groups.map((group, index) => {
              return (
                <div className={"gameTable-" + group} id={"gameTable-" + group}>
                  <p className="tableLabel">
                    <b>{group}</b> {lang ? "group" : "grupa"}
                    <span className="tableError" id={"tableError-" + group} />
                  </p>
                  <Table
                    cols={[
                      lang ? "Team" : "Komanda",
                      lang ? "Team" : "Komanda",
                      lang ? "Date" : "Datums",
                      lang ? "Time" : "Laiks",
                      lang ? "Referees" : "Tiesneši",
                      lang ? "Venue" : "Vieta",
                      lang ? "Group" : "Grupa",
                    ]}
                    id={"gameTable" + group}
                    content={gameScheduleReady.filter(
                      (game) => game[6] === group,
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="tournamentInfo__container">
          <div className="tournamentInfo">
            <div className="fileInput-image img-center">
              <img
                src={logo ? logo : logoImg}
                alt={lang ? "Tournament logo" : "Turnīra logo"}
              />
            </div>

            <div>
              <h2>{tournament.name}</h2>
              <p>
                {tournament.groupNum} {lang ? "groups" : "grupas"},{" "}
                {tournament.teamNum} {lang ? "teams" : "komandas"}
              </p>
              <p>{finals ? finals : ""}</p>
            </div>
          </div>
          <div className="submitCont">
            <SubmitInput
              value={lang ? "Create" : "Izveidot"}
              backValue={lang ? "Back" : "Atpakaļ"}
              inputID="continueFrom4"
              backInputID="backFrom4"
              includeBack={true}
              onBackClick={() => {
                navigate("/app/tournaments/new/3");
              }}
              onClick={(e) => {
                e.preventDefault();
                const data = submitData(e);
                if (!data) return;
                navigate("/app/tournaments/new/send");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
