// TODO: Sort games, get previous 3, next 3
// TODO: Add data to 'current' section (sort so in middle is current or next game)
import React from "react";

import Table from "../../components/tables/tables";

import "./public.css";
import { useNavigate, useParams } from "react-router-dom";

export default function PublicPage() {
    // Set states
    const [tournament, setTournament] = React.useState(null);
    const [games, setGames] = React.useState([]);
    const [teams, setTeams] = React.useState([]);
    const [referees, setReferees] = React.useState([]);
    const [playoffs, setPlayoffs] = React.useState([]);
    const [teamBlocks, setTeamBlocks] = React.useState([]);
    const [team3p, setTeam3p] = React.useState([]);
    const [teamPoints, setTeamPoints] = React.useState([]);
    const [teamPointsAgainst, setTeamPointsAgainst] = React.useState([]);
    const [bestScorers, setBestScorers] = React.useState([]);
    const [bestBlockers, setBestBlockers] = React.useState([]);

    const params = useParams();
    const navigate = useNavigate();

    const getData = async () => {
        // Get tournament ID
        const tournamentIDreq = await fetch(
            "http://localhost:8080/api/tournaments/getIDfromName?name=" +
                params["*"]
        );
        const tournamentID = await tournamentIDreq.json();

        // If tournament ID is not found, navigate to 404
        if (!tournamentID) {
            navigate("/404");
            return;
        }

        // Set tournament ID
        setTournament(tournamentID);

        // Get teams
        const gamereq = await fetch(
            "http://localhost:8080/api/tournaments/" +
                tournamentID.id +
                "/games"
        );
        let games = await gamereq.json();

        const playoffsArr = [];

        // Find all playoff games and push to arrray
        games.forEach((game) => {
            if (game.finals !== 0) {
                playoffsArr.push(game);
            }
        });

        // Remove playoff games from response
        games = games.filter((game) => {
            return game.finals === 0;
        });

        // Sort games by group
        games.sort((a, b) => a.gamegroup - b.gamegroup);

        let gamesByGroups = Array.from({ length: games.length }, () => []);

        for (let i = 0; i < games.length; i++) {
            games.filter((game) => {
                if (game.gamegroup === i) {
                    gamesByGroups[i].push(game);
                }
            });
        }

        gamesByGroups.forEach((group) => {
            group.sort((a, b) => a.gamedate - b.gamedate);
        });

        gamesByGroups = gamesByGroups.filter((el) => {
            return el.length > 0;
        });

        // Get referees
        const refreq = await fetch(
            "http://localhost:8080/api/tournaments/" +
                tournamentID.id +
                "/referees",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                        "access_token"
                    )}`,
                },
            }
        );
        const refereeData = await refreq.json();

        // Get teams
        const teamreq = await fetch(
            "http://localhost:8080/api/tournaments/" +
                tournamentID.id +
                "/teams"
        );
        const teamsData = await teamreq.json();

        teamsData.sort((a, b) => {
            return a.teamgroup - b.teamgroup;
        });

        let teamsInGroups = [];
        for (let i = 0; i < teamsData.length; i++) {
            if (teamsInGroups[teamsData[i].teamgroup] === undefined) {
                teamsInGroups[teamsData[i].teamgroup] = [];
            }
            teamsInGroups[teamsData[i].teamgroup].push(teamsData[i]);
        }

        // Sort teams by stats
        const teamBlocks = teamsData.sort((a, b) => {
            return b.avgblocks - a.avgblocks;
        });

        const team3p = teamsData.sort((a, b) => {
            return b.avg3ppoints - a.avg3points;
        });

        const teamPoints = teamsData.sort((a, b) => {
            return b.avgpoints - a.avgpoints;
        });

        const teamPointsAgainst = teamsData.sort((a, b) => {
            return b.avglostpoints - a.avglostpoints;
        });

        // Make best scorers request to API
        const bestScorersRequest = await fetch(
            "http://localhost:8080/api/tournaments/" +
                tournamentID.id +
                "/stats/best-players",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                        "access_token"
                    )}`,
                },
            }
        );

        const bestScorersResponse = await bestScorersRequest.json();

        // Make best blockers request to API
        const bestBlockersRequest = await fetch(
            "http://localhost:8080/api/tournaments/" +
                tournamentID.id +
                "/stats/best-blockers",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                        "access_token"
                    )}`,
                },
            }
        );

        const bestBlockersResponse = await bestBlockersRequest.json();

        // Set best players data
        setBestScorers(bestScorersResponse.slice(0, 5));
        setBestBlockers(bestBlockersResponse.slice(0, 5));

        // Set stat data
        setTeamBlocks(teamBlocks);
        setTeam3p(team3p);
        setTeamPoints(teamPoints);
        setTeamPointsAgainst(teamPointsAgainst);

        // Set referee data
        setReferees(refereeData);

        // Set teams
        setTeams(teamsInGroups);
        console.log(teamsInGroups);

        // Set games
        setGames(gamesByGroups);

        // Set playoffs
        setPlayoffs(playoffsArr);
    };

    React.useEffect(() => {
        getData();
    }, []);

    return (
        <div className="publicPage__cont">
            <div className="banner">
                <h1>{tournament ? tournament.name : 'Lādējās...'}</h1>
            </div>
            <div className="row">
                <div className="desc__cont element">
                    <p>
                        {tournament ? tournament.description : 'Lādējās...'}
                    </p>
                    <div>
                        <i class="fa-solid fa-location-dot"></i>
                        <p>{tournament ? tournament.location : 'Lādējās...'}</p>
                    </div>
                    <p>Organizē {tournament ? tournament.organizer : 'Lādējās...'}</p>
                </div>
                <div className="spacerImg element" style={tournament && tournament.logo ? {background: "url('" + tournament.logo + "')", backgroundPosition: 'center', backgroundSize: 'contian'} : {}}></div>
                <div className="jump__cont element">
                    <p>Lekt uz:</p>
                    <ul>
                        <li>
                            <a href="#now">Tagad</a>
                        </li>
                        <li>
                            <a href="#games">Spēles</a>
                        </li>
                        <li>
                            <a href="#groups">Grupas</a>
                        </li>
                        <li>
                            <a href="#stats">Statistika</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="row" id="now">
                <div className="game">
                    <div className="teams">
                        <div className="team">
                            <img
                                src="main.jpg"
                                alt="Team logo (symbolic meaning)"
                            />
                            <h3>Čempionu komanda!</h3>
                        </div>
                        <h3 className="vs">VS</h3>
                        <div className="team">
                            <img
                                src="main.jpg"
                                alt="Team logo (symbolic meaning)"
                            />
                            <h3>Ceturtās klases vilki</h3>
                        </div>
                    </div>
                    <div className="gameData__cont">
                        <h2>130</h2>
                        <div className="gameData">
                            <p>A grupa</p>
                            <p>03/12/2024</p>
                            <p>12:00</p>
                        </div>
                        <h2>89</h2>
                    </div>
                    <div className="live__content">
                        <i className="fa-solid fa-circle"></i>
                        <p>LIVE</p>
                    </div>
                </div>
                <div className="game live">
                    <div className="teams">
                        <div className="team">
                            <img
                                src="main.jpg"
                                alt="Team logo (symbolic meaning)"
                            />
                            <h3>Čempionu komanda!</h3>
                        </div>
                        <h3 className="vs">VS</h3>
                        <div className="team">
                            <img
                                src="main.jpg"
                                alt="Team logo (symbolic meaning)"
                            />
                            <h3>Ceturtās klases vilki</h3>
                        </div>
                    </div>
                    <div className="gameData__cont">
                        <h2>130</h2>
                        <div className="gameData">
                            <p>A grupa</p>
                            <p>03/12/2024</p>
                            <p>12:00</p>
                        </div>
                        <h2>89</h2>
                    </div>
                    <div className="live__content">
                        <i className="fa-solid fa-circle"></i>
                        <p>LIVE</p>
                    </div>
                </div>
                <div className="game">
                    <div className="teams">
                        <div className="team">
                            <img
                                src="main.jpg"
                                alt="Team logo (symbolic meaning)"
                            />
                            <h3>Čempionu komanda!</h3>
                        </div>
                        <h3 className="vs">VS</h3>
                        <div className="team">
                            <img
                                src="main.jpg"
                                alt="Team logo (symbolic meaning)"
                            />
                            <h3>Ceturtās klases vilki</h3>
                        </div>
                    </div>
                    <div className="gameData__cont">
                        <h2>130</h2>
                        <div className="gameData">
                            <p>A grupa</p>
                            <p>03/12/2024</p>
                            <p>12:00</p>
                        </div>
                        <h2>89</h2>
                    </div>
                    <div className="live__content">
                        <i className="fa-solid fa-circle"></i>
                        <p>LIVE</p>
                    </div>
                </div>
            </div>
            <div className="games" id="games">
                {games.map((group, index) => {
                    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

                    return (
                        <div>
                            <p
                                style={{
                                    margin: "25px 0 8px 10px",
                                    fontWeight: 400,
                                }}
                            >
                                <b>{alphabet[index]}</b> grupa
                            </p>
                            <Table
                                pubTable
                                cols={[
                                    "Komanda",
                                    "Komanda",
                                    "Datums",
                                    "Laiks",
                                    "Vieta",
                                    "Rezultāts",
                                    "Tiesneši",
                                ]}
                                content={group.map((game) => {
                                    const refArr = JSON.parse(game.refereeids);
                                    const refs = referees.filter((ref) => {
                                        return refArr.includes(ref.id);
                                    });

                                    const team1 = teams
                                        .map((group) =>
                                            group.filter((team) => {
                                                return team.id === game.team1id;
                                            })
                                        )
                                        .filter(
                                            (team) => team.length > 0
                                        )[0][0];

                                    const team2 = teams
                                        .map((group) =>
                                            group.filter((team) => {
                                                return team.id === game.team2id;
                                            })
                                        )
                                        .filter(
                                            (team) => team.length > 0
                                        )[0][0];
                                    console.log(team1);
                                    return [
                                        team1.name,
                                        team2.name,
                                        new Date(game.date).toLocaleDateString(
                                            "en-GB",
                                            {
                                                year: "2-digit",
                                                month: "2-digit",
                                                day: "2-digit",
                                            }
                                        ),
                                        new Date(game.date).toLocaleTimeString(
                                            "en-GB",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        ),
                                        game.venue,
                                        game.team1points +
                                            " - " +
                                            game.team2points,
                                        refs
                                            .map((ref) => {
                                                return ref.name;
                                            })
                                            .join(", "),
                                    ];
                                })}
                                id={"publicGameTable-" + index}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="groups" id="groups">
                {teams.map((group, index) => {
                    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
                    group.forEach((team) => (team.teamgroup = alphabet[index]));
                    return (
                        <div className="groupTable">
                            <p
                                style={{
                                    margin: "25px 0 8px 10px",
                                    fontWeight: 400,
                                }}
                            >
                                <b>{group[0].teamgroup}</b> grupa
                            </p>
                            <Table
                                pubTable
                                cols={[
                                    "Nosaukums",
                                    "Spēlētāji",
                                    "Uzv.",
                                    "Zaud.",
                                    "Neizšķ.",
                                    "Punkti",
                                ]}
                                content={group.map((team) => {
                                    return [
                                        team.name,
                                        <a
                                            href="#"
                                            id={
                                                "viewPlayers-" +
                                                team.id +
                                                "-group-" +
                                                index
                                            }
                                        >
                                            skatīt
                                        </a>,
                                        team.wins,
                                        team.losses,
                                        team.ties,
                                        team.tournamentpoints,
                                    ];
                                })}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="stats" id="stats">
                <div className="statCard">
                    <h2>Veiksmīgi bloki</h2>
                    <div className="listContainer">
                        <ol>
                            {teamBlocks.map((team, index) => {
                                return <li key={index}>{team.name}</li>;
                            })}
                        </ol>
                        <ul>
                            {teamBlocks.map((team, index) => {
                                return <li key={index}>{team.avgblocks}</li>;
                            })}
                        </ul>
                    </div>
                </div>
                <div className="statCard">
                    <h2>Veiksmīgi 3p metieni</h2>
                    <div className="listContainer">
                        <ol>
                            {team3p.map((team, index) => {
                                return <li key={index}>{team.name}</li>;
                            })}
                        </ol>
                        <ul>
                            {team3p.map((team, index) => {
                                return <li key={index}>{team.avg3points}</li>;
                            })}
                        </ul>
                    </div>
                </div>
                <div className="statCard">
                    <h2>Rezultatīvākie spēlētāji</h2>
                    <div className="listContainer">
                        <ol>
                            {bestScorers.map((player, index) => {
                                return (
                                    <li key={index}>
                                        {player.firstname} {player.lastname}
                                    </li>
                                );
                            })}
                        </ol>
                        <ul>
                            {bestScorers.map((player, index) => {
                                return <li key={index}>{player.points}</li>;
                            })}
                        </ul>
                    </div>
                </div>
                <div className="statCard">
                    <h2>Labākie bloķētāji</h2>
                    <div className="listContainer">
                        <ol>
                            {bestBlockers.map((player, index) => {
                                return (
                                    <li key={index}>
                                        {player.firstname} {player.lastname}
                                    </li>
                                );
                            })}
                        </ol>
                        <ul>
                            {bestBlockers.map((player, index) => {
                                return <li key={index}>{player.blocks}</li>;
                            })}
                        </ul>
                    </div>
                </div>
                <div className="statCard">
                    <h2>Punkti spēlē</h2>
                    <div className="listContainer">
                        <ol>
                            {teamPoints.map((team, index) => {
                                return <li key={index}>{team.name}</li>;
                            })}
                        </ol>
                        <ul>
                            {teamPoints.map((team, index) => {
                                return <li key={index}>{team.avgpoints}</li>;
                            })}
                        </ul>
                    </div>
                </div>
                <div className="statCard">
                    <h2>Ielaistie punkti</h2>
                    <div className="listContainer">
                        <ol>
                            {teamPointsAgainst.map((team, index) => {
                                return <li key={index}>{team.name}</li>;
                            })}
                        </ol>
                        <ul>
                            {teamPointsAgainst.map((team, index) => {
                                return (
                                    <li key={index}>{team.avglostpoints}</li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            <footer>
                <div>
                    <p>
                        &copy; Copyright {new Date().getFullYear()} Ogres 1.
                        vidusskola
                    </p>
                    <p>All rights reserved.</p>
                    <p>Visas tiesības aizsargātas.</p>
                </div>
                <p>
                    Izveidots izmantojot <a href="#">Gandrīz NBA</a>
                </p>
            </footer>
        </div>
    );
}
