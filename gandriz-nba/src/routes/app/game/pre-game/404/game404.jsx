import React from "react";

import "./game404.css";
import Button from "../../../../../components/button/button";
import { useNavigate } from "react-router-dom";

export default function Game404() {
    const navigate = useNavigate();
    document.title = "Neatradām spēli | Gandriz NBA";

    return (
        <div className="game404">
            <h1>
                4<i class="fa-solid fa-basketball" />4
            </h1>
            <h2>Mums izskatās, ka esi ieradies nepareizajā stadionā...</h2>
            <p>Mēs neatradām spēli ko meklēji :-(</p>
            <p>Pamēģini vēlreiz vai sazinies ar mums!</p>
            <br />
            <Button
                text="Atpakaļ uz mājām"
                onClick={() => {
                    navigate("/app");
                }}
            />
        </div>
    );
}
