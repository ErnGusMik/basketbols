import React from "react";
import Button from "./../../../../../components/button/button";
import KeyboardBtn from "../../../../../components/tournament-pages/keyboard/keyboard-button";

import "./keyboard.css";
import { useNavigate, useParams } from "react-router-dom";

export default function Keyboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div className="keyboard__container">
      <div className="points horizontalCont verticalStart">
        <div className="flexCont">
          <h2>Čempionu komanda!</h2>
          <div className="horizontalCont center mainBtns">
            <KeyboardBtn text="1" caption="+1 punkts" />
            <KeyboardBtn text="2" caption="+2 punkti" />
            <KeyboardBtn text="3" caption="+3 punkti" />
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
            <h2>Ceturtās klases vilki</h2>
            <div
              className="horizontalCont center mainBtns"
              id="pointsInstruction2"
            >
              <KeyboardBtn text="1" caption="+1 punkts" />
              <KeyboardBtn text="2" caption="+2 punkti" />
              <KeyboardBtn text="3" caption="+3 punkti" />
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
        pēc tam teksta lodziņā ievadiet spēlētāja numuru, kurš iemeta bumbu
        grozā.
      </p>
      <div className="points horizontalCont verticalStart">
        <div className="flexCont verticalStart mainBtns_cont">
          <h2 className="hiddenH2">Čempionu komanda!</h2>
          <div className="flexCont horizontalCont verticalStart mainBtns">
            <KeyboardBtn text="Q" caption="+1 piezīme" />
            <KeyboardBtn text="W" caption="+1 bloks" />
            <KeyboardBtn text="E" caption="+1 min pārtraukums" />
          </div>
        </div>
        <p style={{ maxWidth: "150px" }}>
          Kad nepieciešams, ievadiet spēlētāja nr. teksta lodziņā.
        </p>
        <div className="flexCont verticalStart mainBtns_cont">
          <h2 className="hiddenH2">Cetrutās klases vilki</h2>
          <div className="flexCont horizontalCont verticalStart mainBtns">
            <KeyboardBtn text="I" caption="+1 piezīme" />
            <KeyboardBtn text="O" caption="+1 bloks" />
            <KeyboardBtn text="P" caption="+1 min pārtraukums" />
          </div>
        </div>
      </div>
      <hr />
      <div className="horizontalCont verticalStart center mainBtns">
        <KeyboardBtn text="G" caption="24s" />
        <KeyboardBtn text="H" caption="14s" />
      </div>
      <div className="spaceBtn__cont">
        <span className="spaceBtn"></span>
        <p>Pauzēt/turpināt laika atskaiti</p>
      </div>
      <div className="keyboard__readyBtn">
        <div>
          <Button
            text="Gatavs"
            onClick={() => {
              navigate("/game/" + id + "/play");
            }}
          />
        </div>
      </div>
    </div>
  );
}
