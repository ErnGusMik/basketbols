// TODO: send data to server and redirect to tournament page

import React from "react";
import { useNavigate } from "react-router-dom";

import "./new-tournament-send.css";

export default function NewTournamentSend() {
    // Set required vars
    const navigate = useNavigate();
    document.title = "Izveidot | Jauns turnīrs | Gandrīz NBA";
    const idToken = localStorage.getItem("id_token");
    const accessToken = localStorage.getItem("access_token");

    // Set states
    const [sentOnce, setSentOnce] = React.useState(false);

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
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const response = await request.json();

        // If response contains error, set UI to error state and redirect to new tournament page
        if (response.error && !sentOnce) {
            setSentOnce(true);
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

        setSentOnce(true);

        console.log(
            "[INFO] " + Date.now() + ": Tournament successfully created"
        );

        return response;
    };

    // Send teams to server
    const sendTeams = async (tournamentID) => {
        // const jwtData = parseJwt(idToken);

        // Get teams from local storage
        const teams = JSON.parse(localStorage.getItem("teams"));
        const teamsArray = [];

        // For every team, push name, head coach and group to new array
        teams.forEach((team) => {
            teamsArray.push({
                name: team[0],
                headCoach: team[1],
                group: team[3],
            });
        });

        // Set request body
        const bodyData = {
            tournamentID,
            teams: teamsArray,
        };
        // Make request to server
        const request = await fetch(
            "http://localhost:8080/api/teams/new/batch",
            {
                method: "POST",
                body: JSON.stringify(bodyData),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Get response
        const response = await request.json();

        console.log("[INFO] " + Date.now() + ": Teams successfully created");

        return response;
    };

    // Send players to server
    const sendPlayers = async (teamIDs, tournamentID) => {
        // Get teams from local storage
        const teamData = JSON.parse(localStorage.getItem("teams"));
        const players = [];

        // If teams or teamIDs are not set, set error
        if (!teamData) return console.log("Error: teams not set");
        if (!teamIDs)
            return console.log("Error: teamIDs not received from server");

        if (teamIDs.length !== teamData.length) {
            return console.log("Error: teamIDs and teamData length mismatch"); // Set error
        }

        // For each team, push players to object
        teamData.forEach((team, i) => {
            team[2].forEach((player) => {
                if (!player[0] || !player[1] || !player[2]) return;
                players.push({
                    teamID: teamIDs[i],
                    firstName: player[0],
                    lastName: player[1],
                    number: player[2],
                });
            });
        });

        // Set request body
        const bodyData = {
            players,
            tournamentID,
        };

        // Make request to server
        const request = await fetch(
            "http://localhost:8080/api/players/new/batch",
            {
                method: "POST",
                body: JSON.stringify(bodyData),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Get response
        const response = await request.json();

        console.log("[INFO] " + Date.now() + ": Players succesfully stored");

        return response;
    };

    const sendReferees = async (tournamentID) => {
        // Get referees from local storage
        const refereeData = JSON.parse(localStorage.getItem("referees"));
        const refereeNum = localStorage.getItem("refereeNum");

        // Set boilerplate
        let allowedReferees = 0;
        const bodyData = {
            tournamentID,
            referees: [],
        };

        // Check if there are enough referees for playoffs
        refereeData.forEach((referee) => {
            if (referee[1]) allowedReferees++;
        });

        // If not, allow all to be referees for playoffs
        if (allowedReferees < refereeNum) {
            refereeData.forEach((referee) => {
                bodyData.referees.push({
                    name: referee[0],
                    finals: true,
                });
            });
        } else {
            refereeData.forEach((referee) => {
                bodyData.referees.push({
                    name: referee[0],
                    finals: referee[1],
                });
            });
        }

        // Make request to server
        const request = await fetch(
            "http://localhost:8080/api/referees/new/batch",
            {
                method: "POST",
                body: JSON.stringify(bodyData),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Get response
        const response = await request.json();

        console.log("[INFO] " + Date.now() + ": Referees successfully stored");

        return response;
    };

    const sendGames = async (tournamentID) => {
        // Get game schedule from local storage
        const gameSchedule = JSON.parse(localStorage.getItem("gameSchedule"));

        const bodyData = {
            tournamentID,
            games: [],
        };

        // For each game, push data to object
        gameSchedule.forEach((group) => {
            group.forEach((game) => {
                bodyData.games.push({
                    group: game.group,
                    date: game.date,
                    referees: game.referees.split(", "),
                    team1Name: game.team1,
                    team2Name: game.team2,
                    time: game.time,
                    venue: game.venue,
                });
            });
        });

        // Make request to server
        const request = await fetch(
            "http://localhost:8080/api/games/new/batch",
            {
                method: "POST",
                body: JSON.stringify(bodyData),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Get response
        const response = await request.json();

        console.log("[INFO] " + Date.now() + ": Games successfully created");

        return response;
    };

    // Function to run on component mount (useEffect can't be async)
    const final = async () => {
        const tournamentID = await createTournament();

        if (tournamentID.error) return;

        const teamIDs = await sendTeams(tournamentID);

        await sendPlayers(teamIDs, tournamentID);

        sendingNotes.current.innerHTML = "Gandrīz gatavs!";

        await sendReferees(tournamentID);

        setTimeout(() => {
            sendingNotes.current.innerHTML =
                "Šis aizņem mazliet vairāk laika nekā parasti...";
            sendingNotesSub.current.innerHTML = "Lūdzu, neatsvaidziniet lapu!";
        }, 5000);

        await sendGames(tournamentID);

        console.log(
            "[INFO] " + Date.now() + ": Tournament creation process finalized"
        );
        navigate("/app/tournaments/" + tournamentID);

        localStorage.removeItem("tournament");
        localStorage.removeItem("teams");
        localStorage.removeItem("gameSchedule");
        localStorage.removeItem("tournamentLogo");
        localStorage.removeItem("referees");
        localStorage.removeItem("refereeNum");
    };

    React.useEffect(() => {
        final();
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
