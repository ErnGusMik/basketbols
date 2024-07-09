import React from "react";
import Button from "./../../../../../components/button/button";
import KeyboardBtn from "../../../../../components/tournament-pages/keyboard/keyboard-button";

import "./mouse.css";
import { useNavigate, useParams } from "react-router-dom";

export default function Mouse() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  return (
    <div className="mouse__container keyboard__container">
      <div className="points horizontalCont verticalStart">
        <div className="flexCont">
          <h2>{lang ? "Team 1" : "1. komanda"}</h2>
          <div className="horizontalCont center mainBtns">
            <KeyboardBtn text="1" caption={lang ? "+1 point" : "+1 punkts"} />
            <KeyboardBtn text="2" caption={lang ? "+2 points" : "+2 punkti"} />
            <KeyboardBtn text="3" caption={lang ? "+3 points" : "+3 punkti"} />
          </div>
        </div>
        <div className="flexCont horizontalCont">
          <div>
            <h2>{lang ? "Team 2" : "2. komanda"}</h2>
            <div
              className="horizontalCont center mainBtns"
              id="pointsInstruction2"
            >
              <KeyboardBtn text="1" caption={lang ? "+1 point" : "+1 punkts"} />
              <KeyboardBtn
                text="2"
                caption={lang ? "+2 points" : "+2 punkti"}
              />
              <KeyboardBtn
                text="3"
                caption={lang ? "+3 points" : "+3 punkti"}
              />
            </div>
          </div>
        </div>
      </div>
      <p>
        {lang
          ? "afterwards, in the text box, enter the number of the player that scored"
          : "pēc tam teksta lodziņā ievadiet spēlētāja numuru, kurš iemeta bumbu grozā"}
        .
      </p>
      <div className="points horizontalCont verticalStart">
        <div className="flexCont verticalStart mainBtns_cont">
          <h2 className="hiddenH2">{lang ? "Team 1" : "1. Komanda"}</h2>
          <div className="flexCont horizontalCont verticalStart mainBtns">
            <KeyboardBtn
              text={<i class="fa-solid fa-circle-xmark" />}
              caption={lang ? "+1 foul" : "+1 piezīme"}
            />
            <KeyboardBtn
              text={<i class="fa-solid fa-circle-xmark" />}
              caption={lang ? "+1 block" : "+1 bloks"}
            />
            <KeyboardBtn
              text={<i class="fa-solid fa-hourglass-start" />}
              caption={lang ? "+1 timeout" : "+1 min. pārtraukums"}
            />
          </div>
        </div>
        <p style={{ maxWidth: "150px" }}>
          {lang
            ? "When necessary, enter the appropriate player number in the textbox popup"
            : "Kad nepieciešams, ievadiet spēlētāja nr. teksta lodziņā"}
          .
        </p>
        <div className="flexCont verticalStart mainBtns_cont">
          <h2 className="hiddenH2">{lang ? "Team 2" : "2. Komanda"}</h2>
          <div className="flexCont horizontalCont verticalStart mainBtns">
            <KeyboardBtn
              text={<i class="fa-solid fa-circle-xmark" />}
              caption={lang ? "+1 foul" : "+1 piezīme"}
            />
            <KeyboardBtn
              text={<i class="fa-solid fa-circle-xmark" />}
              caption={lang ? "+1 block" : "+1 bloks"}
            />
            <KeyboardBtn
              text={<i class="fa-solid fa-hourglass-start" />}
              caption={lang ? "+1 timeout" : "+1 min. pārtraukums"}
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="horizontalCont verticalStart center mainBtns">
        <KeyboardBtn pointer text="24" caption="24s" />
        <KeyboardBtn pointer text="14" caption="14s" />
      </div>
      <div className="spaceBtn__cont">
        <span className="spaceBtn">
          <i class="fa-solid fa-play" />
          <p>/</p>
          <i class="fa-solid fa-pause" />
        </span>
        <p>
          {lang ? "Pause/continue the match" : "Pauzēt/turpināt laika atskaiti"}
        </p>
      </div>
      <div className="keyboard__readyBtn">
        <div>
          <Button
            text={lang ? "Ready!" : "Gatavs"}
            onClick={() => {
              navigate("/game/" + id + "/play");
            }}
          />
        </div>
      </div>
    </div>
  );
}
