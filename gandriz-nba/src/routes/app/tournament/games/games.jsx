// TODO: make this according to design
// TODO: save server data to local storage for faster loading
import React from "react";
import { useParams } from 'react-router-dom'

import './games.css';

export default function TournamentGames() {
    // Set states
    const [tournament, setTournament] = React.useState({});
    const [games, setGames] = React.useState([]);
    const [teams, setTeams] = React.useState([]);

    // Set vars & title
    document.title = tournament.name ? 'Spēles' + tournament.name + '| Gandrīz NBA' : 'Lādējās | Gandrīz NBA';
    const params = useParams();

    // Get tournament data from server
    const getTournamentData = async () => {
        // Get url param (tournamentID)
        const { id } = params;

        // Make request to server
        const request = await fetch(
            'http://localhost:8080/api/tournaments/' + id,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            }
        );

        // Get response
        const response = await request.json();

        // Set tournament data
        setTournament(response);
    };

    // Get game data
    // Get team data

    // useEffect can't be async, so run this function isnstead
    const final = async () => {
        await getTournamentData();
    };

    // Run on page load
    React.useEffect(() => {
        final();
    });

    return (
        <div className="tournamentGames">
            <div className="stickyContainer flexCont">
                <MainImage titleData={tournament.name ? tournament.name : ""} />
                <div className="descriptionCard">
                    <p className="description">{tournament.description}</p>
                    <div className="location">
                        <i className="fa-solid fa-location-dot fa-lg"></i>
                        <p className="locationText">{tournament.location}</p>
                    </div>
                    <p className="organizer">
                        Organizē{" "}
                        <b className="organizerName">{tournament.organizer}</b>
                    </p>
                </div>
            </div>
            <div className="tournamentGamesContainer flexCont">
                <div className="playoffsContainer">
                    {/* DISPLAY: FLEX and align to center vertically */}
                </div>
                <div className="tableContainer">
                    {}
                </div>
            </div>
        </div>
    );
};