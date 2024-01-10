// TODO: Remove ability to add teams after max limit is reached
// TODO: Add abilty to view teams (same modal, with abilty to change team data, incl. delete it)

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
  const topRef = React.useRef()

  // set most states
  const [teamNum, setTeamNum] = React.useState(0);
  const [groupNum, setGroupNum] = React.useState([]);
  const [groupNumSub, setGroupNumSub] = React.useState([]);
  const [selectedGroup, setSelectedGroup] = React.useState(0);
  const [finalsNum, setFinalsNum] = React.useState([]);
  const [finalsSub, setFinalsSub] = React.useState([]);
  // set page title
  document.title = "Jauns turnīrs | GandrīzNBA";
  // handle change of team number (on change)
  const teamNumChnage = (e) => {
    setTeamNum(e.target.value);
    setFinalsNumValue(0);
    setSelectedGroup(0)
  };
  // handle change of group number (on change)
  const groupNumChange = (e) => {
    const allowedFinals = [16, 8, 4, 2];
    const allowedSub = ["Astotdaļ.", "Ceturtdaļ.", "Pusfināli", "Fināls"];
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
    const request = await fetch("http://localhost:8080/" + obj.pageName, {
      method: "GET",
    });
    const response = await request.json();
    if (response.result) {
      setPageError("eksistē!");
      document.getElementById("submit-page1").disabled = false;
      topRef.current.scrollTo(0, 0);
      return;
    } else if (obj.pageName.includes(" ") || obj.pageName.includes(".")) {
      setPageError("ir nederīgs!");
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
      localStorage.removeItem('teams')
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
              label="Turnīra nosaukums"
              placeholder="Skolas čempis 2023"
              inputID="name"
              required={true}
            />
            <TextInput
              label="Turnīra lapas nosaukums"
              placeholder="skolascempis2023"
              inputID="pageName"
              notes="www.majaslapa.lv/"
              notesValue={true}
              required={true}
              error={pageError}
            />
            <Textarea
              label="Turnīra apraksts"
              placeholder="Ogres 1. Vidusskolas 2023. gada basketbola čempionāts, kurā piedalās 7-12 klases."
              inputID="description"
              required={true}
            />
            <TextInput
              label="Turnīra organizatori"
              placeholder="Ogres 1. Vidusskola"
              inputID="organizer"
              required={true}
            />
            <TextInput
              label="Norises vieta"
              placeholder="Ogre"
              inputID="location"
              required={true}
            />
          </div>
          <div className="flexCol">
            <FileInput
              label="Turnīra logo"
              inputID="logo"
              notes="300 px x 300 px"
              notes2="Max. 2 MB"
            />
            <TextInput
              label="Komandu skaits"
              inputID="teamNum"
              placeholder="32"
              notes="Komandu skaitam ir jābūt pāra skaitlim!"
              onChange={teamNumChnage}
              required={true}
            />
            <RadioInput
              label="Grupu skaits"
              labelSub="Katra komanda spēlēs ar visām pārējām savā grupā."
              inputID="groupNum"
              value={groupNum.slice(0, 5)}
              valueSub={groupNumSub.slice(0, 5)}
              error="Komandu skaitam ir jādalās ar 2, 4, 16, 32, 64 vai 128!"
              onChange={groupNumChange}
              required={true}
            />
            <RadioInput
              label="Izslēgšanas spēles"
              labelSub="Cik komandas tiek izslēgšanas spēlēs?"
              inputID="finalsNum"
              error="Izvēlietes grupu skaitu lai katrā grupā būtu 2+ komandas!"
              value={finalsNum}
              valueSub={finalsSub}
              onChange={handleFinalsNum}
              required={true}
            />
            <div className="submitContainer">
              <div>
                <p>
                  Katrā grupā spēlēs{" "}
                  <b>
                    {teamNum && selectedGroup ? teamNum / selectedGroup : 0}
                  </b>{" "}
                  komandas.
                </p>
                <p>
                  Katras grupas <b>{finalsNumValue}</b> labākās komandas spēlēs
                  izslēgšanas spēlēs.
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
