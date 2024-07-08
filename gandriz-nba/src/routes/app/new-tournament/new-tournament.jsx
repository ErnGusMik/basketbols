import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./new-tournament.css";
import Progress from "../../../components/progress/progress";
import FileInput from "../../../components/file-input/input";
import TextInput from "../../../components/text-input/input";
import RadioInput from "../../../components/radio-input/input";
import Textarea from "../../../components/textarea/textarea";
import SubmitInput from "../../../components/submit-input/input";

export default function NewTournament() {
  // get all factors of a number
  const getFactors = (num) => {
    let factors = [];
    for (let i = 1; i <= num; i++) {
      // check if number is a factor
      if (num % i === 0) {
        factors.push(i);
      }
    }
    return factors;
  };

  // create ref
  const topRef = React.useRef();

  // set most states
  const [teamNum, setTeamNum] = React.useState(0);
  const [groupNum, setGroupNum] = React.useState([]);
  const [groupNumSub, setGroupNumSub] = React.useState([]);
  const [selectedGroup, setSelectedGroup] = React.useState(0);
  const [finalsNum, setFinalsNum] = React.useState([]);
  const [finalsSub, setFinalsSub] = React.useState([]);
  const [lang, setLang] = React.useState(Boolean(localStorage.getItem("lang")));

  // set page title
  document.title = lang
    ? "New tournament | Gandrīz NBA"
    : "Jauns turnīrs | Gandrīz NBA";
  // handle change of team number (on change)
  const teamNumChnage = (e) => {
    setTeamNum(e.target.value);
    setFinalsNumValue(0);
    setSelectedGroup(0);
  };
  // handle change of group number (on change)
  const groupNumChange = (e) => {
    const allowedFinals = [16, 8, 4, 2];
    const allowedSub = [
      lang ? "Rnd of 16" : "Astotdaļ.",
      lang ? "Quarterf." : "Ceturtdaļ.",
      lang ? "Semi-finals" : "Pusfināli",
      lang ? "Final" : "Fināls",
    ];
    const selectedGroup = e.target.value;
    if (selectedGroup === "NaN" || selectedGroup === "Infinity") {
      setSelectedGroup(0);
    } else {
      setSelectedGroup(selectedGroup);
    }
    const teamsInGroup = teamNum / selectedGroup;
    let possibleFinals = [];
    let possibleFinalsSub = [];
    for (let i = 0; i < allowedFinals.length; i++) {
      if (
        selectedGroup <= allowedFinals[i] &&
        allowedFinals[i] / selectedGroup <= teamsInGroup
      ) {
        possibleFinals.push(allowedFinals[i]);
        possibleFinalsSub.push(allowedSub[i]);
      }
    }
    setFinalsNum(possibleFinals);
    setFinalsSub(possibleFinalsSub);
  };
  // handle change of finals number (on change) and display by Next button
  const [finalsNumValue, setFinalsNumValue] = React.useState(0);
  const handleFinalsNum = (e) => {
    const selectedFinals = e.target.value;
    setFinalsNumValue(selectedFinals / selectedGroup);
  };

  // handle change of group number (on load)
  React.useEffect(() => {
    const allowed = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
    let groupNums = getFactors(teamNum);
    let teamsInGroup = [];
    let groupNumPossible = [];
    for (let i = 0; i < groupNums.length; i++) {
      for (let j = 0; j < allowed.length; j++) {
        if (groupNums[i] === allowed[j]) {
          groupNumPossible.push(allowed[j]);
          teamsInGroup.push(teamNum / allowed[j] + " kom.");
        }
      }
    }
    setGroupNum(groupNumPossible);
    setGroupNumSub(teamsInGroup);
    setFinalsNum([]);
  }, [teamNum]);

  // handle submit
  const [pageError, setPageError] = React.useState(false);
  const [readyForNavigate, setNavigate] = React.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const obj = Object.fromEntries(data.entries());
    if (!obj.groupNum && !obj.finalsNum) {
      return;
    }
    document.getElementById("submit-page1").disabled = true;
    const request = await fetch(
      "https://basketbols.onrender.com/" + obj.pageName,
      {
        method: "GET",
      },
    );
    const response = await request.json();
    if (response.result) {
      setPageError(lang ? "exists!" : "eksistē!");
      document.getElementById("submit-page1").disabled = false;
      topRef.current.scrollTo(0, 0);
      return;
    } else if (obj.pageName.includes(" ") || obj.pageName.includes(".")) {
      setPageError(lang ? "is not valid!" : "ir nederīgs!");
      document.getElementById("submit-page1").disabled = false;
      topRef.current.scrollTo(0, 0);
      return;
    } else {
      setPageError(false);
    }
    let reader = new FileReader();
    let file = obj.logo;
    reader.readAsDataURL(file);
    reader.onloadend = async function (e) {
      localStorage.setItem("tournament", JSON.stringify(obj));
      localStorage.setItem("tournamentLogo", reader.result);
      localStorage.removeItem("teams");
      setNavigate(true);
    };
    return;
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (readyForNavigate) {
      navigate("/app/tournaments/new/2", { replace: true });
    }
  }, [readyForNavigate]);

  return (
    <div className="new-tournament" ref={topRef}>
      <Progress progress={1} />
      <form onSubmit={handleSubmit} className="new-tournament-1">
        <div className="horizontalCont">
          <div className="flexCol">
            <TextInput
              label={lang ? "Tournament name" : "Turnīra nosaukums"}
              placeholder={
                lang
                  ? "School tournament " + new Date().getFullYear()
                  : "Skolas čempis " + new Date().getFullYear()
              }
              inputID="name"
              required={true}
            />
            <TextInput
              label={lang ? "Tournament website" : "Turnīra lapas nosaukums"}
              placeholder={
                lang
                  ? "schooltournament" + new Date().getFullYear()
                  : "skolascempis" + new Date().getFullYear()
              }
              inputID="pageName"
              notes="www.erngusmik.github.io/"
              notesValue={true}
              required={true}
              error={pageError}
            />
            <Textarea
              label={lang ? "Tournament description" : "Turnīra apraksts"}
              placeholder={
                lang
                  ? "Riga state gymnasium No3's " +
                    new Date().getFullYear() +
                    " basketball tournament for grades 7-12."
                  : "Ogres 1. Vidusskolas " +
                    new Date().getFullYear() +
                    ". gada basketbola čempionāts, kurā piedalās 7-12 klases."
              }
              inputID="description"
              required={true}
            />
            <TextInput
              label={
                lang ? "Tournament organizer(s)" : "Turnīra organizators(i)"
              }
              placeholder={
                lang ? "Riga state gymnasium No3" : "Ogres 1. vidusskola"
              }
              inputID="organizer"
              required={true}
            />
            <TextInput
              label={lang ? "Tournament location" : "Norises vieta"}
              placeholder={lang ? "Riga" : "Ogre"}
              inputID="location"
              required={true}
            />
          </div>
          <div className="flexCol">
            <FileInput
              label={lang ? "Tournament logo" : "Turnīra logo"}
              inputID="logo"
              notes="300 px x 300 px"
              notes2="Max. 2 MB"
            />
            <TextInput
              label={lang ? "Team count" : "Komandu skaits"}
              inputID="teamNum"
              placeholder="32"
              notes={
                lang
                  ? "The team count must be an even number!"
                  : "Komandu skaitam ir jābūt pāra skaitlim!"
              }
              onChange={teamNumChnage}
              required={true}
            />
            <RadioInput
              label={lang ? "Group count" : "Grupu skaits"}
              labelSub={
                lang
                  ? "Every team will play with every other team in their group"
                  : "Katra komanda spēlēs ar visām pārējām savā grupā."
              }
              inputID="groupNum"
              value={groupNum.slice(0, 5)}
              valueSub={groupNumSub.slice(0, 5)}
              error={
                lang
                  ? "The team count must be divisable by 2, 4, 16, 32, 64, or 128!"
                  : "Komandu skaitam ir jādalās ar 2, 4, 16, 32, 64 vai 128!"
              }
              onChange={groupNumChange}
              required={true}
            />
            <RadioInput
              label={lang ? "Playoffs" : "Izslēgšanas spēles"}
              labelSub={
                lang
                  ? "How many teams get to play in the playoffs?"
                  : "Cik komandas tiek izslēgšanas spēlēs?"
              }
              inputID="finalsNum"
              error={
                lang
                  ? "Choose a group count so that every group contains at least 2 teams!"
                  : "Izvēlietes grupu skaitu lai katrā grupā būtu 2+ komandas!"
              }
              value={finalsNum}
              valueSub={finalsSub}
              onChange={handleFinalsNum}
              required={true}
            />
            <div className="submitContainer">
              <div>
                <p>
                  {lang ? "Every team will contain" : "Katrā grupā spēlēs"}{" "}
                  <b>
                    {teamNum && selectedGroup ? teamNum / selectedGroup : 0}
                  </b>{" "}
                  {lang ? "teams" : "komandas"}.
                </p>
                <p>
                  {lang ? "Every group's" : "Katras grupas"}{" "}
                  <b>{finalsNumValue}</b>{" "}
                  {lang
                    ? "best teams will get to play in the playoffs"
                    : "labākās komandas spēlēs izslēgšanas spēlēs"}
                  .
                </p>
              </div>
              <SubmitInput inputID="submit-page1" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
