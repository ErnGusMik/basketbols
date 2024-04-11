// ? IF TIME: add viewTransition to navs!
import React from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";

import "./tournament-nav.css";

export default function TournamentNav() {
    const { id } = useParams();
    const navigate = useNavigate();

    const navigateToAbout = () => {
        if (window.location.pathname === "/app/tournaments/" + id) {
            navigate("/app/tournaments/" + id + "/about");
        }
    };

    React.useEffect(() => {
        navigateToAbout();
    }, []);

    return (
        <div className="tournament__container">
            <div className="tournament-nav">
                <div className="tournament-nav-item" id="tournament-nav-1">
                    <NavLink
                        to={"/app/tournaments/" + id + "/about"}
                        end
                        unstable_viewTransition
                        className="navLink"
                    >
                        {({ isActive }) => (
                            <div>
                                Info
                                <span
                                    className={
                                        isActive ? "active tabLine" : "tabLine"
                                    }
                                 />
                            </div>
                        )}
                    </NavLink>
                </div>
                <div className="tournament-nav-item" id="tournament-nav-2">
                    <NavLink
                        to={"/app/tournaments/" + id + "/teams"}
                        end
                        unstable_viewTransition
                        className="navLink"
                    >
                        {({ isActive }) => (
                            <div>
                                Komandas
                                <span
                                    className={
                                        isActive ? "active tabLine" : "tabLine"
                                    }
                                 />
                            </div>
                        )}
                    </NavLink>
                </div>
                <div className="tournament-nav-item" id="tournament-nav-3">
                    <NavLink
                        to={"/app/tournaments/" + id + "/stats"}
                        end
                        unstable_viewTransition
                        className="navLink"
                    >
                        {({ isActive }) => (
                            <div>
                                Statistika
                                <span
                                    className={
                                        isActive ? "active tabLine" : "tabLine"
                                    }
                                 />
                            </div>
                        )}
                    </NavLink>
                </div>
                <div className="tournament-nav-item" id="tournament-nav-4">
                    <NavLink
                        to={"/app/tournaments/" + id + "/games"}
                        end
                        unstable_viewTransition
                        className="navLink"
                    >
                        {({ isActive }) => (
                            <div>
                                Spēles
                                <span
                                    className={
                                        isActive ? "active tabLine" : "tabLine"
                                    }
                                 />
                            </div>
                        )}
                    </NavLink>
                </div>
            </div>
            <div id="tournamentOutlet">
                <Outlet />
            </div>
        </div>
    );
}
