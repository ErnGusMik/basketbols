import React from "react";

import Table from "../../components/tables/tables";

import "./public.css";
import { useNavigate, useParams, Link } from "react-router-dom";
import basketballImg from "./basketball.png";

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
    const [tempPlayers, setTempPlayers] = React.useState({
        teamName: "Komanda 1",
        players: [
            {
                firstname: "Vārds",
                lastname: "Uzvārds",
                number: 11,
                points: 30,
                blocks: 2,
            },
        ],
    });

    const [lang, setLang] = React.useState(
        Boolean(localStorage.getItem("lang"))
    );

    const [now, setNow] = React.useState({
        previous: {
            team1: "Komanda 1",
            team2: "Komanda 2",
            team1points: 0,
            team2points: 0,
            time: new Date(),
            group: "A",
            ongoing: false,
        },
        current: {
            team1: "Komanda 1",
            team2: "Komanda 2",
            team1points: 0,
            team2points: 0,
            time: new Date(),
            group: "A",
            ongoing: true,
        },
        next: {
            team1: "Komanda 1",
            team2: "Komanda 2",
            team1points: 0,
            team2points: 0,
            time: new Date(),
            group: "A",
            ongoing: false,
        },
    });
    const [loaded, setLoaded] = React.useState(false);

    const params = useParams();
    const navigate = useNavigate();

    // Change language
    const changeLanguage = () => {
        if (localStorage.getItem("lang") === "en") {
            localStorage.removeItem("lang");
            setLang(false);
            return;
        }
        localStorage.setItem("lang", "en");
        setLang(true);
    };

    // Get data from API
    const getData = async () => {
        // Get tournament ID
        const tournamentIDreq = await fetch(
            "https://basketbols.onrender.com/api/tournaments/getIDfromName?name=" +
                params["*"]
        );
        const tournamentID = await tournamentIDreq.json();

        // If tournament ID is not found, navigate to 404
        if (!tournamentID.id) {
            navigate("/404");
            return;
        }

        // Set tournament ID
        setTournament(tournamentID);

        // Get teams
        const gamereq = await fetch(
            "https://basketbols.onrender.com/api/tournaments/" +
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
            "https://basketbols.onrender.com/api/tournaments/" +
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
            "https://basketbols.onrender.com/api/tournaments/" +
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
            "https://basketbols.onrender.com/api/tournaments/" +
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
            "https://basketbols.onrender.com/api/tournaments/" +
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

        // Set games
        setGames(gamesByGroups);

        // Set playoffs
        setPlayoffs(playoffsArr);

        // Finish loading animation
        setLoaded(true);
    };

    // Set the ongoing/live game row
    const setNowGames = async () => {
        // Alphabet for groups
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

        // Get all games
        const allGames = games.flat().concat(playoffs);

        // Sort games by timestamp
        const sortedGames1 = allGames.sort((a, b) => {
            return new Date(a.time) - new Date(b.time);
        });

        const sortedGames = [];
        sortedGames1.forEach((game) => {
            sortedGames.push({
                team1: teams.flat().find((team) => {
                    return team.id === game.team1id;
                }).name,
                team2: teams.flat().find((team) => {
                    return team.id === game.team2id;
                }).name,
                team1points: game.team1points,
                team2points: game.team2points,
                time: new Date(game.time),
                group: alphabet[game.gamegroup],
                public_id: game.public_id,
            });
        });

        const gamesWithPublicIDs = sortedGames
            .filter((game) => {
                return game.public_id !== null;
            })
            .flat()
            .sort((a, b) => {
                return a.time - b.time;
            });

        // Fetch ongoing game public IDs
        const ongoingGames = await fetch(
            "https://basketbols.onrender.com/api/games/live",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const ongoingData = await ongoingGames.json();

        //Add ongoing property to games
        sortedGames.forEach((game) => {
            if (!game.public_id) {
                game.ongoing = false;
            } else {
                game.ongoing = false;
                ongoingData.forEach((ongoingGame) => {
                    if (game.public_id === ongoingGame.id) {
                        game.ongoing = true;
                    }
                });
            }
        });

        // If only one game in total
        if (sortedGames.length === 1) {
            setNow({
                previous: null,
                current: sortedGames[0],
                next: null,
            });
        }

        // If only two games in total
        if (sortedGames.length === 2) {
            setNow({
                previous: null,
                current: sortedGames[0],
                next: sortedGames[1],
            });
        }

        if (sortedGames.length === 3) {
            setNow({
                previous: sortedGames[0],
                current: sortedGames[1],
                next: sortedGames[2],
            });
        }

        if (sortedGames.length > 3) {
            const lastGame = sortedGames.toReversed().find((game) => {
                return new Date(game.time) < new Date();
            });
            const lastGameIndex = sortedGames.indexOf(lastGame);
            if (lastGameIndex === 0) {
                setNow({
                    previous: sortedGames[0],
                    current: sortedGames[1],
                    next: sortedGames[2],
                });
            } else if (lastGameIndex === sortedGames.length - 1) {
                setNow({
                    previous: sortedGames[lastGameIndex - 2],
                    current: sortedGames[lastGameIndex - 1],
                    next: sortedGames[lastGameIndex],
                });
            } else {
                setNow({
                    previous: sortedGames[lastGameIndex - 1],
                    current: sortedGames[lastGameIndex],
                    next: sortedGames[lastGameIndex + 1],
                });
            }
        }
    };

    React.useEffect(() => {
        setNowGames();
    }, [games]);

    React.useEffect(() => {
        getData();
    }, []);

    // Set up loading animation
    React.useEffect(() => {
        // Define iteration function that runs when animation ends
        const iterationFunc = () => {
            document.querySelector(".loadingOverlay").style.opacity = "0";
            document.querySelector(".loadingOverlay img").style.animation =
                "loadingFade 3s linear 0s normal";
            setTimeout(() => {
                document
                    .querySelector(".loadingOverlay img")
                    .removeEventListener("animationiteration", iterationFunc);
                document.querySelector(".loadingOverlay").style.display =
                    "none";
            }, 3000);
        };

        // If loaded, add event listener to get animation end
        if (loaded) {
            document
                .querySelector(".loadingOverlay img")
                .addEventListener("animationiteration", iterationFunc);
        }

        // Cleanup (throws error on page switch)
        // if (loaded) {
        //     return () => {
        //         document
        //             .querySelector(".loadingOverlay img")
        //             .removeEventListener("animationiteration", iterationFunc);
        //     };
        // }
    }, [loaded]);

    // Show player overlay
    const showPlayers = async (teamID) => {
        // Fetch players from API
        const teamRequest = await fetch(
            "https://basketbols.onrender.com/api/teams/" + teamID + "/players",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const teamData = await teamRequest.json();

        // Set temp players state
        setTempPlayers({
            teamName: teams.flat().find((team) => {
                return team.id === teamID;
            }).name,
            players: teamData,
        });

        // Show overlay
        const overlay = document.getElementById("playersOverlay");
        overlay.style.display = "flex";
        document.body.style.overflow = "hidden";
    };

    // Close overlay
    const closeOverlay = () => {
        const overlay = document.getElementById("playersOverlay");
        overlay.style.display = "none";
        document.body.style.overflow = "auto";
    };

    return (
        <div className="publicPage__cont">
            <i
                className="fa-solid fa-globe changeLang"
                onClick={changeLanguage}
            ></i>
            <div className="loadingOverlay">
                <img src={basketballImg} alt="Basketball image" />
                <svg width={300} height={3}>
                    <rect
                        width={300}
                        height={3}
                        style={{ fill: "rgb(0,0,0)" }}
                    />
                </svg>
            </div>
            <div className="banner">
                <h1>
                    {tournament
                        ? tournament.name
                        : lang
                        ? "Loading..."
                        : "Lādējās..."}
                </h1>
            </div>
            <div className="row">
                <div className="desc__cont element">
                    <p>
                        {tournament
                            ? tournament.description
                            : lang
                            ? "Loading..."
                            : "Lādējās..."}
                    </p>
                    <div>
                        <i class="fa-solid fa-location-dot"></i>
                        <p>
                            {tournament
                                ? tournament.location
                                : lang
                                ? "Loading..."
                                : "Lādējās..."}
                        </p>
                    </div>
                    <p>
                        {lang ? "Organized by" : "Organizē"}{" "}
                        {tournament
                            ? tournament.organizer
                            : lang
                            ? "Loading..."
                            : "Lādējās..."}
                    </p>
                </div>
                <div
                    className="spacerImg element"
                    style={
                        tournament && tournament.logo
                            ? {
                                  background: "url('" + tournament.logo + "')",
                                  backgroundPosition: "center",
                                  backgroundSize: "contian",
                              }
                            : {}
                    }
                ></div>
                <div className="jump__cont element">
                    <p>{lang ? "Jump to" : "Lekt uz"}:</p>
                    <ul>
                        <li>
                            <a href="#now">{lang ? "Now" : "Tagad"}</a>
                        </li>
                        <li>
                            <a href="#games">{lang ? "Games" : "Spēles"}</a>
                        </li>
                        <li>
                            <a href="#groups">{lang ? "Groups" : "Grupas"}</a>
                        </li>
                        <li>
                            <a href="#stats">
                                {lang ? "Statistics" : "Statistika"}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="row" id="now">
                {now.previous && (
                    <Link
                        className={now.previous.ongoing ? "game live" : "game"}
                        to={
                            now.previous.ongoing
                                ? "/game/" + now.previous.public_id + "/watch"
                                : ""
                        }
                    >
                        <div className="teams">
                            <div className="team">
                                <img
                                    src="main.jpg"
                                    alt="Team logo (symbolic meaning)"
                                />
                                <h3>{now.previous.team1}</h3>
                            </div>
                            <h3 className="vs">VS</h3>
                            <div className="team">
                                <img
                                    src="main.jpg"
                                    alt="Team logo (symbolic meaning)"
                                />
                                <h3>{now.previous.team2}</h3>
                            </div>
                        </div>
                        <div className="gameData__cont">
                            <h2>{now.previous.team1points}</h2>
                            <div className="gameData">
                                <p>
                                    {lang ? "Group " : ""}
                                    {now.previous.group}
                                    {lang ? "" : " grupa"}
                                </p>
                                <p>
                                    {new Date(
                                        now.previous.time
                                    ).toLocaleDateString("en-GB", {
                                        year: "2-digit",
                                        month: "2-digit",
                                        day: "2-digit",
                                    })}
                                </p>
                                <p>
                                    {new Date(
                                        now.previous.time
                                    ).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                            <h2>{now.previous.team2points}</h2>
                        </div>
                        <div className="live__content">
                            <i className="fa-solid fa-circle"></i>
                            <p>LIVE</p>
                        </div>
                    </Link>
                )}
                {now.current && (
                    <Link
                        className={now.current.ongoing ? "game live" : "game"}
                        to={
                            now.current.ongoing
                                ? "/game/" + now.current.public_id + "/watch"
                                : ""
                        }
                    >
                        <div className="teams">
                            <div className="team">
                                <img
                                    src="main.jpg"
                                    alt="Team logo (symbolic meaning)"
                                />
                                <h3>{now.current.team1}</h3>
                            </div>
                            <h3 className="vs">VS</h3>
                            <div className="team">
                                <img
                                    src="main.jpg"
                                    alt="Team logo (symbolic meaning)"
                                />
                                <h3>{now.current.team2}</h3>
                            </div>
                        </div>
                        <div className="gameData__cont">
                            <h2>{now.current.team1points}</h2>
                            <div className="gameData">
                                <p>
                                    {lang ? "Group " : ""}
                                    {now.current.group}
                                    {lang ? "" : " grupa"}
                                </p>
                                <p>
                                    {new Date(
                                        now.current.time
                                    ).toLocaleDateString("en-GB", {
                                        year: "2-digit",
                                        month: "2-digit",
                                        day: "2-digit",
                                    })}
                                </p>
                                <p>
                                    {new Date(
                                        now.current.time
                                    ).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                            <h2>{now.current.team2points}</h2>
                        </div>
                        <div className="live__content">
                            <i className="fa-solid fa-circle"></i>
                            <p>LIVE</p>
                        </div>
                    </Link>
                )}
                {now.next && (
                    <Link
                        className={now.next.ongoing ? "game live" : "game"}
                        to={
                            now.next.ongoing
                                ? "/game/" + now.next.public_id + "/watch"
                                : "#"
                        }
                    >
                        <div className="teams">
                            <div className="team">
                                <img
                                    src="main.jpg"
                                    alt="Team logo (symbolic meaning)"
                                />
                                <h3>{now.next.team1}</h3>
                            </div>
                            <h3 className="vs">VS</h3>
                            <div className="team">
                                <img
                                    src="main.jpg"
                                    alt="Team logo (symbolic meaning)"
                                />
                                <h3>{now.next.team2}</h3>
                            </div>
                        </div>
                        <div className="gameData__cont">
                            <h2>{now.next.team1points}</h2>
                            <div className="gameData">
                                <p>
                                    {lang ? "Group " : ""}
                                    {now.next.group}
                                    {lang ? "" : " grupa"}
                                </p>
                                <p>
                                    {new Date(now.next.time).toLocaleDateString(
                                        "en-GB",
                                        {
                                            year: "2-digit",
                                            month: "2-digit",
                                            day: "2-digit",
                                        }
                                    )}
                                </p>
                                <p>
                                    {new Date(now.next.time).toLocaleTimeString(
                                        "en-GB",
                                        { hour: "2-digit", minute: "2-digit" }
                                    )}
                                </p>
                            </div>
                            <h2>{now.next.team2points}</h2>
                        </div>
                        <div className="live__content">
                            <i className="fa-solid fa-circle"></i>
                            <p>LIVE</p>
                        </div>
                    </Link>
                )}
            </div>
            <div className="games" id="games">
                {games.map((group, index) => {
                    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    group.sort((a, b) => {
                        return new Date(a.time) - new Date(b.time);
                    });

                    return (
                        <div>
                            <p
                                style={{
                                    margin: "25px 0 8px 10px",
                                    fontWeight: 400,
                                }}
                            >
                                <b>{alphabet[index]}</b>{" "}
                                {lang ? "group" : "grupa"}
                            </p>
                            <Table
                                pubTable
                                cols={[
                                    lang ? "Team" : "Komanda",
                                    lang ? "Team" : "Komanda",
                                    lang ? "Date" : "Datums",
                                    lang ? "Time" : "Laiks",
                                    lang ? "Venue" : "Vieta",
                                    lang ? "Score" : "Rezultāts",
                                    lang ? "Referees" : "Tiesneši",
                                    lang ? "Watch" : "Skatīt",
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
                                        game.public_id ? (
                                            <Link
                                                to={
                                                    "/game/" +
                                                    game.public_id +
                                                    "/watch"
                                                }
                                            >
                                                {lang ? "watch" : "skatīt"}
                                            </Link>
                                        ) : (
                                            ""
                                        ),
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
                                <b>{group[0].teamgroup}</b>{" "}
                                {lang ? "group" : "grupa"}
                            </p>
                            <Table
                                pubTable
                                cols={[
                                    lang ? "Team" : "Komanda",
                                    lang ? "Players" : "Spēlētāji",
                                    lang ? "Won" : "Uzv.",
                                    lang ? "Lost" : "Zaud.",
                                    lang ? "Drawn" : "Neizšķ.",
                                    lang ? "Points" : "Punkti",
                                ]}
                                content={group.map((team) => {
                                    return [
                                        team.name,
                                        <a
                                            onClick={() => {
                                                showPlayers(team.id);
                                            }}
                                            id={
                                                "viewPlayers-" +
                                                team.id +
                                                "-group-" +
                                                index
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            {lang ? "view" : "skatīt"}
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
                    <h2>{lang ? "Successful blocks" : "Veiksmīgi bloki"}</h2>
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
                    <h2>
                        {lang ? "Successful 3pt shots" : "Veiksmīgi 3p metieni"}
                    </h2>
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
                    <h2>
                        {lang ? "Best scorers" : "Rezultatīvākie spēlētāji"}
                    </h2>
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
                    <h2>{lang ? "Best blockers" : "Labākie bloķētāji"}</h2>
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
                    <h2>{lang ? "Points per game" : "Punkti spēlē"}</h2>
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
                    <h2>
                        {lang ? "Points scored against" : "Ielaistie punkti"}
                    </h2>
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
                        &copy; Copyright {new Date().getFullYear()} Gandrīz NBA
                        &{" "}
                        {tournament
                            ? tournament.organizer
                            : lang
                            ? "Loading..."
                            : "Lādējās..."}
                    </p>
                    <p>All rights reserved.</p>
                    <p>Visas tiesības aizsargātas.</p>
                </div>
                <p>
                    {lang ? "Created using" : "Izveidots izmantojot"}{" "}
                    <Link to="/">Gandrīz NBA</Link>
                </p>
            </footer>
            <div className="playersOverlay" id="playersOverlay">
                <div className="playersOverlayData">
                    <img
                        src={basketballImg}
                        alt="Basketball"
                        className="absoluteDecor"
                    />
                    <i
                        className="fa-solid fa-close closeBtn"
                        onClick={closeOverlay}
                    ></i>
                    <h2>{tempPlayers.teamName}</h2>
                    <p>
                        <b>{lang ? "Players" : "Spēlētāji"}</b>
                    </p>
                    <div className="cardCont">
                        {tempPlayers.players.map((player, index) => {
                            return (
                                <div className="playerCard" key={index}>
                                    <h2>{player.number}</h2>
                                    <p>
                                        {lang ? "Points" : "Punkti"}:{" "}
                                        <b>{player.points}</b>
                                    </p>
                                    <p>
                                        {lang ? "Blocks" : "Bloki"}:{" "}
                                        <b>{player.blocks}</b>
                                    </p>
                                    <h3>
                                        {player.firstname}{" "}
                                        <span className="uppercase">
                                            {player.lastname}
                                        </span>
                                    </h3>
                                    <div className="backg"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
