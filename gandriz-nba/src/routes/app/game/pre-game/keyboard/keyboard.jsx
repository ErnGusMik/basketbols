import React from "react";
import Button from "./../../../../../components/button/button";
import KeyboardBtn from "../../../../../components/tournament-pages/keyboard/keyboard-button";

import "./keyboard.css";
import { useNavigate, useParams } from "react-router-dom";

export default function Keyboard() {
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
    <div className="keyboard__container">
      <div className="points horizontalCont verticalStart">
        <div className="flexCont">
          <h2>{lang ? "Team 1" : "1. komanda"}</h2>
          <div className="horizontalCont center mainBtns">
            <KeyboardBtn text="1" caption={lang ? "+1 point" : "+1 punkts"} />
            <KeyboardBtn text="2" caption={lang ? "+2 points" : "+2 punkti"} />
            <KeyboardBtn text="3" caption={lang ? "+3 points" : "+3 punkti"} />
          </div>
          <div className="horizontalCont flexStart">
            <KeyboardBtn text="1" small />
            <KeyboardBtn text="2" small />
            <KeyboardBtn text="3" small />
            <KeyboardBtn text="4" small gray />
            <KeyboardBtn text="5" small gray />
            <KeyboardBtn text="6" small gray />
            <KeyboardBtn text="7" small gray />
            <KeyboardBtn text="8" small gray />
            <KeyboardBtn text="9" small gray />
            <KeyboardBtn text="0" small gray />
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
          <div className="verticalNums__cont">
            <div className="horizontalCont verticalNums">
              <KeyboardBtn text="7" small gray />
              <KeyboardBtn text="8" small gray />
              <KeyboardBtn text="9" small gray />
            </div>
            <div className="horizontalCont verticalNums">
              <KeyboardBtn text="4" small gray />
              <KeyboardBtn text="5" small gray />
              <KeyboardBtn text="6" small gray />
            </div>
            <div className="horizontalCont verticalNums">
              <KeyboardBtn text="1" small />
              <KeyboardBtn text="2" small />
              <KeyboardBtn text="3" small />
            </div>
            <div className="horizontalCont verticalNums">
              <span className="keyboardButton large-0">0</span>
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
            <KeyboardBtn text="Q" caption={lang ? "+1 foul" : "+1 piezīme"} />
            <KeyboardBtn text="W" caption={lang ? "+1 block" : "+1 bloks"} />
            <KeyboardBtn
              text="E"
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
          <h2 className="hiddenH2">{lang ? "Team 2" : "2. komanda"}</h2>
          <div className="flexCont horizontalCont verticalStart mainBtns">
            <KeyboardBtn text="I" caption={lang ? "+1 foul" : "+1 piezīme"} />
            <KeyboardBtn text="O" caption={lang ? "+1 block" : "+1 bloks"} />
            <KeyboardBtn
              text="P"
              caption={lang ? "+1 timeout" : "+1 min. pārtraukums"}
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="horizontalCont verticalStart center mainBtns">
        <KeyboardBtn text="G" caption="24s" />
        <KeyboardBtn text="H" caption="14s" />
      </div>
      <div className="spaceBtn__cont">
        <span className="spaceBtn" />
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
