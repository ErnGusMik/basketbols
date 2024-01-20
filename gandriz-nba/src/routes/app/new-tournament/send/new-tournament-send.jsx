// TODO: send data to server and redirect to tournament page

import React from "react";
import { useNavigate } from "react-router-dom";

import "./new-tournament-send.css";

export default function NewTournamentSend() {

    // Set required vars
    const navigate = useNavigate()
    document.title = "Izveidot | Jauns turnīrs | Gandrīz NBA"
    const idToken = localStorage.getItem("id_token")

    // Set states
    //
    //

    // Send tournament data to server
    const createTournament = async () => {
        const data = null // decode jwt (new library needed?)
        console.log(data)
        // send to server
    }

    React.useEffect(() => {
        createTournament()
    }, [])

    return (
        <div className="new-tournament-send__container">
            <div className="new-tournament-send">
                <p className="sending">Veidojam jūsu turnīru...</p>
                <span id="sendingNotes">Lūdzu, neatsvaidzini lapu!</span>
            </div>
        </div>
    )
}