import React from "react";
import "./new-tournament.css";
import Progress from "../../../components/progress/progress";
import FileInput from "../../../components/file-input/input";
import TextInput from "../../../components/text-input/input";
import RadioInput from "../../../components/radio-input/input";
import Textarea from "../../../components/textarea/textarea";
import SubmitInput from "../../../components/submit-input/input";

export default function NewTournament() {
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
  const [teamNum, setTeamNum] = React.useState(0);
  const [groupNum, setGroupNum] = React.useState([]);
  const [groupNumSub, setGroupNumSub] = React.useState([]);
  const [selectedGroup, setSelectedGroup] = React.useState(0);
  const [finalsNum, setFinalsNum] = React.useState([]);
  const [finalsSub, setFinalsSub] = React.useState([]);
  document.title = "Jauns turnīrs | GandrīzNBA";
  const teamNumChnage = (e) => {
    setTeamNum(e.target.value);
  };
  const groupNumChange = (e) => {
    const allowedFinals = [16, 8, 4, 2];
    const allowedGroups = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
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
    // only 16, 8, 4, or 2 teams can go forward. make sure from each team an equal amount goes forward. DOESNT WORK COMPLETELY!
    for (let i = 0; i < allowedFinals.length; i++) {
        if (allowedFinals[i] % selectedGroup === 0) {
            if (teamsInGroup >= allowedFinals[i]) {
                possibleFinals.push(allowedFinals[i]);
                possibleFinalsSub.push(allowedSub[i]);
            }
        }
    }
    setFinalsNum(possibleFinals);
    setFinalsSub(possibleFinalsSub);
  };
  const [finalsNumValue, setFinalsNumValue] = React.useState(0);
  const handleFinalsNum = (e) => {
    setFinalsNumValue(teamNum / e.target.value);
  }

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

  return (
    <div className="new-tournament">
      <Progress progress={1} />
      <div className="horizontalCont">
        <div className="flexCol">
          <TextInput
            label="Turnīra nosaukums"
            placeholder="Skolas čempis 2023"
            inputID="name"
          />
          <TextInput
            label="Turnīra lapas nosaukums"
            placeholder="skolascempis2023"
            inputID="pageName"
            notes="www.majaslapa.lv/"
            notesValue={true}
          />
          <Textarea
            label="Turnīra apraksts"
            placeholder="Ogres 1. Vidusskolas 2023. gada basketbola čempionāts, kurā piedalās 7-12 klases."
            inputID="description"
          />
          <TextInput
            label="Turnīra organizatori"
            placeholder="Ogres 1. Vidusskola"
            inputID="organizer"
          />
          <TextInput
            label="Norises vieta"
            placeholder="Ogre"
            inputID="location"
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
          />
          <RadioInput
            label="Grupu skaits"
            labelSub="Katra komanda spēlēs ar visām pārējām savā grupā."
            inputID="groupNum"
            value={groupNum.slice(0, 5)}
            valueSub={groupNumSub.slice(0, 5)}
            error="Komandu skaitam ir jādalās ar 2, 4, 16, 32, 64 vai 128!"
            onChange={groupNumChange}
          />
          <RadioInput
            label="Izslēgšanas spēles"
            labelSub="Cik komandas tiek izslēgšanas spēlēs?"
            inputID="finalsNum"
            error="Izvēlietes grupu skaitu lai katrā grupā būtu 2+ komandas!"
            value={finalsNum}
            valueSub={finalsSub}
            onChange={handleFinalsNum}
          />
          <div className="submitContainer">
            <div>
              <p>
                Katrā grupā spēlēs <b>{teamNum / selectedGroup}</b> komandas.
              </p>
              <p>
                Katras grupas <b>{finalsNumValue}</b> labākās komandas spēlēs izslēgšanas
                spēlēs.
              </p>
            </div>
            <SubmitInput inputID="submit" />
          </div>
        </div>
      </div>
    </div>
  );
}
