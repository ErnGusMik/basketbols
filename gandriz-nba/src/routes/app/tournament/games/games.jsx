import React from "react";
import { useParams } from "react-router-dom";

import MainImage from "../../../../components/tournament-pages/main-image/main-image";
import Table from "../../../../components/tables/tables";

import "./games.css";

export default function TournamentGames() {
  // Set states
  const [tournament, setTournament] = React.useState({});
  const [games, setGames] = React.useState([]);
  const [teams, setTeams] = React.useState([]);
  const [referees, setReferees] = React.useState([]);
  const [playoffs, setPlayoffs] = React.useState([]);

  // Set vars & title
  document.title = tournament.name
    ? "Spēles | " + tournament.name + " | Gandrīz NBA"
    : "Lādējās | Gandrīz NBA";
  const params = useParams();

  // Get tournament data from server
  const getTournamentData = async () => {
    // Get url param (tournamentID)
    const { id } = params;

    // Check if data is in local storage
    if (localStorage.getItem("tournament_" + id)) {
      setTournament(JSON.parse(localStorage.getItem("tournament_" + id)));
      return;
    }

    // Make request to server
    const request = await fetch(
      "https://basketbols.onrender.com/api/tournaments/" + id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      },
    );

    // Get response
    const response = await request.json();

    // Set tournament data
    setTournament(response);

    // Save to local storage
    localStorage.setItem(
      "tournament_" + id,
      JSON.stringify({
        name: response.name,
        description: response.description,
        location: response.location,
        organizer: response.organizer,
        dates: response.dates,
        finalsnum: response.finalsnum,
        groups: response.groups,
        logo: response.logo,
        pagename: response.pagename,
        refereenum: response.refereenum,
      }),
    );
  };

  // Get game data
  const getGameData = async () => {
    // Get url param (tournamentID)
    const { id } = params;

    // Make request to server
    const request = await fetch(
      "https://basketbols.onrender.com/api/tournaments/" + id + "/games",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      },
    );

    // Get response
    let response = await request.json();

    const playoffsArr = [];

    // Find all playoff games and push to arrray
    response.forEach((game) => {
      if (game.finals !== 0) {
        playoffsArr.push(game);
      }
    });

    console.log(playoffsArr);

    // Set playoffs
    setPlayoffs(playoffsArr);

    // Remove playoff games from response
    response = response.filter((game) => {
      return game.finals === 0;
    });

    // Set game data
    response.sort((a, b) => a.gamegroup - b.gamegroup);

    let gamesByGroups = Array.from({ length: response.length }, () => []);

    for (let i = 0; i < response.length; i++) {
      response.filter((game) => {
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

    setGames(gamesByGroups);
  };

  // Get team data
  const getTeamsData = async () => {
    // Get url param (tournamentID)
    const { id } = params;

    // Make request to server
    const request = await fetch(
      "https://basketbols.onrender.com/api/tournaments/" + id + "/teams",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      },
    );

    // Get response
    const response = await request.json();

    // Set game data
    setTeams(response);
  };

  // Get referee data
  const getRefereeData = async () => {
    // Get url param (tournamentID)
    const { id } = params;

    // Make request to server
    const request = await fetch(
      "https://basketbols.onrender.com/api/tournaments/" + id + "/referees",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      },
    );

    // Get response
    const response = await request.json();

    // Set game data
    setReferees(response);
  };

  // useEffect can't be async, so run this function isnstead
  const final = async () => {
    await getTournamentData();
    await getTeamsData();
    await getGameData();
    await getRefereeData();
  };

  // Run on page load
  React.useEffect(() => {
    final();
  }, []);

  React.useEffect(() => {
    console.log(playoffs);
  }, [playoffs]);

  const createPlayoffsChart = () => {
    const eightFinals = [];
    const quarterFinals = [];
    const semiFinals = [];
    let final;
    let thirdPlace;

    playoffs.forEach((game) => {
      if (game.finals === 16) {
        eightFinals.push(game);
      } else if (game.finals === 8) {
        quarterFinals.push(game);
      } else if (game.finals === 4) {
        semiFinals.push(game);
      } else if (game.finals === 2) {
        final = game;
      } else if (game.finals === 3) {
        thirdPlace = game;
      }
    });

    return (
      <div className="playoffsContainer__container">
        <div className="playoffsContainer">
          {eightFinals.length > 0 ? (
            <div className="playoffs">
              <p>Astotdaļfināli</p>
              {Array(8)
                .fill()
                .map((_, i) => {
                  return (
                    <table className="game">
                      <tr>
                        <td>
                          {eightFinals[i] ? (
                            eightFinals[i].team1points
                          ) : (
                            <wbr />
                          )}
                        </td>
                        <td>
                          {eightFinals[i] ? (
                            teams.filter(
                              (team) => eightFinals[i].team1id === team.id,
                            )[0].name
                          ) : (
                            <wbr />
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {eightFinals[i] ? (
                            eightFinals[i].team2points
                          ) : (
                            <wbr />
                          )}
                        </td>
                        <td>
                          {eightFinals[i] ? (
                            teams.filter(
                              (team) => eightFinals[i].team2id === team.id,
                            )[0].name
                          ) : (
                            <wbr />
                          )}
                        </td>
                      </tr>
                    </table>
                  );
                })}
            </div>
          ) : (
            ""
          )}

          {quarterFinals.length > 0 || eightFinals.length > 0 ? (
            <div className="playoffs">
              <p>Ceturtdaļfināli</p>
              {Array(4)
                .fill()
                .map((_, i) => {
                  return (
                    <table className="game">
                      <tr>
                        <td>
                          {quarterFinals[i] ? (
                            quarterFinals[i].team1points
                          ) : (
                            <wbr />
                          )}
                        </td>
                        <td>
                          {quarterFinals[i] ? (
                            teams.filter(
                              (team) => quarterFinals[i].team1id === team.id,
                            )[0].name
                          ) : (
                            <wbr />
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {quarterFinals[i] ? (
                            quarterFinals[i].team2points
                          ) : (
                            <wbr />
                          )}
                        </td>
                        <td>
                          {quarterFinals[i] ? (
                            teams.filter(
                              (team) => quarterFinals[i].team2id === team.id,
                            )[0].name
                          ) : (
                            <wbr />
                          )}
                        </td>
                      </tr>
                    </table>
                  );
                })}
            </div>
          ) : (
            ""
          )}

          {semiFinals.length > 0 ||
          quarterFinals.length > 0 ||
          eightFinals.length > 0 ? (
            <div className="playoffs">
              <p>Pusfināli</p>
              {Array(2)
                .fill()
                .map((_, i) => {
                  return (
                    <table className="game">
                      <tr>
                        <td>
                          {semiFinals[i] ? semiFinals[i].team1points : <wbr />}
                        </td>
                        <td>
                          {semiFinals[i] ? (
                            teams.filter(
                              (team) => semiFinals[i].team1id === team.id,
                            )[0].name
                          ) : (
                            <wbr />
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {semiFinals[i] ? semiFinals[i].team2points : <wbr />}
                        </td>
                        <td>
                          {semiFinals[i] ? (
                            teams.filter(
                              (team) => semiFinals[i].team2id === team.id,
                            )[0].name
                          ) : (
                            <wbr />
                          )}
                        </td>
                      </tr>
                    </table>
                  );
                })}
            </div>
          ) : (
            ""
          )}

          {final ||
          semiFinals.length > 0 ||
          quarterFinals.length > 0 ||
          eightFinals.length > 0 ? (
            <div className="playoffs">
              <p>Fināls</p>
              <table className="game">
                <tr>
                  <td>{final ? final.team1points : <wbr />}</td>
                  <td>
                    {final ? (
                      teams.filter((team) => final.team1id === team.id)[0].name
                    ) : (
                      <wbr />
                    )}
                  </td>
                </tr>
                <tr>
                  <td>{final ? final.team2points : <wbr />}</td>
                  <td>
                    {final ? (
                      teams.filter((team) => final.team2id === team.id)[0].name
                    ) : (
                      <wbr />
                    )}
                  </td>
                </tr>
              </table>
            </div>
          ) : (
            ""
          )}
        </div>

        {eightFinals.length > 0 ? (
          <div className="playoffsTable">
            <p>Astotdaļfināli</p>
            <Table
              cols={[
                "Komanda",
                "Komanda",
                "Datums",
                "Laiks",
                "Vieta",
                "Rezultāts",
                "Tiesneši",
              ]}
              content={eightFinals.map((game) => {
                return [
                  teams.filter((team) => {
                    return team.id === game.team1id;
                  })[0].name,
                  teams.filter((team) => {
                    return team.id === game.team2id;
                  })[0].name,
                  new Date(game.date).toLocaleDateString("en-GB", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                  }),
                  new Date(game.date).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  game.venue,
                  game.team1points + " - " + game.team2points,
                  JSON.parse(game.refereeids)
                    .map((ref, _, arr) => {
                      const filtered = referees.filter((referee) => {
                        return referee.id === ref && referee.name;
                      });
                      console.log(filtered);
                      return filtered[0] ? filtered[0].name : "";
                    })
                    .join(", "),
                ];
              })}
            />
          </div>
        ) : (
          ""
        )}

        {quarterFinals.length > 0 || eightFinals.length > 0 ? (
          <div className="playoffsTable">
            <p>Ceturtdaļfināli</p>
            <Table
              cols={[
                "Komanda",
                "Komanda",
                "Datums",
                "Laiks",
                "Vieta",
                "Rezultāts",
                "Tiesneši",
              ]}
              content={quarterFinals.map((game) => {
                return [
                  teams.filter((team) => {
                    return team.id === game.team1id;
                  })[0].name,
                  teams.filter((team) => {
                    return team.id === game.team2id;
                  })[0].name,
                  new Date(game.date).toLocaleDateString("en-GB", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                  }),
                  new Date(game.date).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  game.venue,
                  game.team1points + " - " + game.team2points,
                  JSON.parse(game.refereeids)
                    .map((ref, _, arr) => {
                      const filtered = referees.filter((referee) => {
                        return referee.id === ref && referee.name;
                      });
                      console.log(filtered);
                      return filtered[0] ? filtered[0].name : "";
                    })
                    .join(", "),
                ];
              })}
            />
          </div>
        ) : (
          ""
        )}

        {semiFinals.length > 0 ||
        quarterFinals.length > 0 ||
        eightFinals.length > 0 ? (
          <div className="playoffsTable">
            <p>Pusfināli</p>
            <Table
              cols={[
                "Komanda",
                "Komanda",
                "Datums",
                "Laiks",
                "Vieta",
                "Rezultāts",
                "Tiesneši",
              ]}
              content={semiFinals.map((game) => {
                return [
                  teams.filter((team) => {
                    return team.id === game.team1id;
                  })[0].name,
                  teams.filter((team) => {
                    return team.id === game.team2id;
                  })[0].name,
                  new Date(game.date).toLocaleDateString("en-GB", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                  }),
                  new Date(game.date).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  game.venue,
                  game.team1points + " - " + game.team2points,
                  JSON.parse(game.refereeids)
                    .map((ref, _, arr) => {
                      const filtered = referees.filter((referee) => {
                        return referee.id === ref && referee.name;
                      });
                      console.log(filtered);
                      return filtered[0] ? filtered[0].name : "";
                    })
                    .join(", "),
                ];
              })}
            />
          </div>
        ) : (
          ""
        )}

        {final ||
        semiFinals.length > 0 ||
        quarterFinals.length > 0 ||
        eightFinals.length > 0 ? (
          <div className="playoffsTable">
            <p>Fināls</p>
            <Table
              cols={[
                "Komanda",
                "Komanda",
                "Datums",
                "Laiks",
                "Vieta",
                "Rezultāts",
                "Tiesneši",
              ]}
              content={
                final
                  ? [
                      [
                        teams.filter((team) => {
                          return team.id === final.team1id;
                        })[0].name,
                        teams.filter((team) => {
                          return team.id === final.team2id;
                        })[0].name,
                        new Date(final.date).toLocaleDateString("en-GB", {
                          year: "2-digit",
                          month: "2-digit",
                          day: "2-digit",
                        }),
                        new Date(final.date).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                        final.venue,
                        final.team1points + " - " + final.team2points,
                        JSON.parse(final.refereeids)
                          .map((ref, _, arr) => {
                            const filtered = referees.filter((referee) => {
                              return referee.id === ref && referee.name;
                            });
                            console.log(filtered);
                            return filtered[0] ? filtered[0].name : "";
                          })
                          .join(", "),
                      ],
                    ]
                  : [["-", "-", "TBC", "TBC", "TBC", "", "TBC"]]
              }
            />
          </div>
        ) : (
          ""
        )}

        {thirdPlace ||
        final ||
        semiFinals.length > 0 ||
        quarterFinals.length > 0 ||
        eightFinals.length > 0 ? (
          <div className="playoffsTable">
            <p>3. vietas spēle</p>
            <Table
              cols={[
                "Komanda",
                "Komanda",
                "Datums",
                "Laiks",
                "Vieta",
                "Rezultāts",
                "Tiesneši",
              ]}
              content={
                thirdPlace
                  ? [
                      [
                        teams.filter((team) => {
                          return team.id === thirdPlace.team1id;
                        })[0].name,
                        teams.filter((team) => {
                          return team.id === thirdPlace.team2id;
                        })[0].name,
                        new Date(thirdPlace.date).toLocaleDateString("en-GB", {
                          year: "2-digit",
                          month: "2-digit",
                          day: "2-digit",
                        }),
                        new Date(thirdPlace.date).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                        thirdPlace.venue,
                        thirdPlace.team1points + " - " + thirdPlace.team2points,
                        JSON.parse(thirdPlace.refereeids)
                          .map((ref, _, arr) => {
                            const filtered = referees.filter((referee) => {
                              return referee.id === ref && referee.name;
                            });
                            console.log(filtered);
                            return filtered[0] ? filtered[0].name : "";
                          })
                          .join(", "),
                      ],
                    ]
                  : [["-", "-", "TBC", "TBC", "TBC", "", "TBC"]]
              }
            />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  return (
    <div className="tournamentGames">
      <div className="stickyContainer flexCont">
        <MainImage titleData={tournament.name ? tournament.name : ""} />
        <div className="descriptionCard">
          <p className="description">{tournament.description}</p>
          <div className="location">
            <i className="fa-solid fa-location-dot fa-lg" />
            <p className="locationText">{tournament.location}</p>
          </div>
          <p className="organizer">
            Organizē <b className="organizerName">{tournament.organizer}</b>
          </p>
        </div>
      </div>
      <div className="tournamentGamesContainer flexCont">
        {playoffs.length > 0 ? createPlayoffsChart() : <div />}

        <div className="tableContainer">
          {games.map((group, index) => {
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

            return (
              <div>
                <p>
                  <b>{alphabet[index]}</b> grupa
                </p>
                <Table
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

                    const team1 = teams.filter((team) => {
                      return team.id === game.team1id;
                    })[0];

                    const team2 = teams.filter((team) => {
                      return team.id === game.team2id;
                    })[0];
                    return [
                      team1.name,
                      team2.name,
                      new Date(game.date).toLocaleDateString("en-GB", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                      }),
                      new Date(game.date).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                      game.venue,
                      game.team1points + " - " + game.team2points,
                      refs
                        .map((ref) => {
                          return ref.name;
                        })
                        .join(", "),
                    ];
                  })}
                  id={"gameTable-" + index}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
