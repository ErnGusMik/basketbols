// TODO: send data to server and redirect to tournament page

import React from "react";
import { useNavigate } from "react-router-dom";

import "./new-tournament-send.css";

export default function NewTournamentSend() {
    // Set required vars
    const navigate = useNavigate();
    document.title = "Izveidot | Jauns turnīrs | Gandrīz NBA";
    const idToken = localStorage.getItem("id_token");

    // Set states
    //
    //

    // Set refs
    const sendingNotes = React.useRef();
    const mainText = React.useRef();
    const sendingNotesSub = React.useRef();

    // Calculate start and end dates of tournament
    const calculateDates = () => {
        const gameSchedule = JSON.parse(localStorage.getItem("gameSchedule"));

        let startDate = new Date(gameSchedule[0][0].date);
        let endDate = new Date(gameSchedule[gameSchedule.length - 1][0].date);

        const dateOptions = {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
        };

        console.log(startDate, endDate);

        for (let i = 0; i < gameSchedule.length; i++) {
            for (let j = 0; j < gameSchedule[i].length; j++) {
                if (gameSchedule[i][j].date < startDate) {
                    startDate = new Date(gameSchedule[i][j].date);
                }
                if (gameSchedule[i][j].date > endDate) {
                    endDate = new Date(gameSchedule[i][j].date);
                }
            }
        }
        return [
            startDate.toLocaleDateString("en-GB", dateOptions),
            endDate.toLocaleDateString("en-GB", dateOptions),
        ];
    };

    // Decode JWT payload
    const parseJwt = (token) => {
        var base64Url = token.split(".")[1];
        var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        var jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split("")
                .map(function (c) {
                    return (
                        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join("")
        );

        return JSON.parse(jsonPayload);
    };

    // Send tournament data to server
    const createTournament = async () => {
        const jwtData = parseJwt(idToken);

        const tournamentData = JSON.parse(localStorage.getItem("tournament"));
        let tournamentLogo = localStorage.getItem("tournamentLogo");
        const refereeNum = localStorage.getItem("refereeNum");

        const dates = calculateDates();

        // If tournament data is not set, redirect to new tournament page
        if (!tournamentData) navigate("/app/tournaments/new");
        if (tournamentLogo == "data:application/octet-stream;base64,")
            tournamentLogo = null;

        const bodyData = {
            userID: jwtData.sub,
            name: tournamentData.name,
            description: tournamentData.description,
            location: tournamentData.location,
            organizer: tournamentData.organizer,
            logo: tournamentLogo,
            dates: dates,
            groups: tournamentData.groupNum,
            finalsNum: tournamentData.finalsNum,
            refereeNum: Number(refereeNum),
            pageName: tournamentData.pageName,
        };

        // Send data to server
        const request = await fetch(
            "http://localhost:8080/api/tournaments/new",
            {
                method: "POST",
                body: JSON.stringify(bodyData),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
            }
        );

        const response = await request.json();

        // If response contains error, set UI to error state and redirect to new tournament page
        if (response.error) {
            mainText.current.innerHTML = "Kļūda!";

            sendingNotes.current.innerHTML = response.detail;
            sendingNotes.current.style.color = "red";

            let seconds = 10;
            sendingNotesSub.current.innerHTML =
                "Ievadiet nepieciešamo informāciju un mēģiniet vēlreiz (pārējā informācija tiks saglabāta). (Pāradresēsim pēc " +
                seconds +
                " sekundēm.)";

            // Set interval to count down from 10 to 0
            const interval = setInterval(() => {
                seconds--;
                sendingNotesSub.current.innerHTML =
                    "Ievadiet nepieciešamo informāciju un mēģiniet vēlreiz (pārējā informācija tiks saglabāta). (Pāradresēsim pēc " +
                    seconds +
                    " sekundēm.)";
            }, 1000);

            setTimeout(() => {
                clearInterval(interval);
            }, 9000);

            setTimeout(() => {
                navigate("/app/tournaments/new");
            }, 10000);
        }
        return response;
    };

    // Send teams to server
    const sendTeams = async (tournamentID) => {
        const jwtData = parseJwt(idToken);


        // TODO: server-side:
        // TODO:   - check if user has access to this tournament
        // TODO:   - add batch team adding (replace the newTeam func?)

        // TODO: client-side:
        // TODO:   - send teams to server
        // TODO:   - etc.
    };

    React.useEffect(() => {
        const tournamentID = createTournament();
        sendTeams(tournamentID);
    }, []);

    return (
        <div className="new-tournament-send__container">
            <div className="new-tournament-send">
                <p className="sending" ref={mainText}>
                    Veidojam jūsu turnīru...
                </p>
                <span id="sendingNotes" ref={sendingNotes}>
                    Lūdzu, neatsvaidzini lapu!
                </span>
                <span id="sendingNotesSub" ref={sendingNotesSub}></span>
            </div>
        </div>
    );
}
