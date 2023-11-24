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
      if (num % i == 0) {
        factors.push(i);
      }
    }
    return factors;
  };
  const [teamNum, setTeamNum] = React.useState(0);
  const [groupNum, setGroupNum] = React.useState([]);
  document.title = "Jauns turnīrs | GandrīzNBA";
  const teamNumChnage = (e) => {
    setTeamNum(e.target.value);
  };
  React.useEffect(() => {
    const allowed = [2, 4, 8, 16, 32, 64, 128];
    let groupNums = getFactors(teamNum);
    let groupNumPossible = [];
    for (let i = 0; i < groupNums.length; i++) {
      for (let j = 0; j < allowed.length; j++) {
        if (groupNums[i] == allowed[j]) {
          groupNumPossible.push(allowed[j]);
        }
      }
    }
    setGroupNum(groupNumPossible);
  }, [teamNum]);
  return (
    <div className="new-tournament">
      <Progress progress={1} />
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
      <TextInput label="Norises vieta" placeholder="Ogre" inputID="location" />

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
        value={groupNum.slice(0, 4)}
        error="Komandu skaitam ir jādalās ar 2, 4, 16, 32, 64 vai 128!"
      />
    </div>
  );
}
