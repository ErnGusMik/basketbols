import React from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";

import "./instructions.css";

export default function Instructions() {
    const { id } = useParams();
    const navigate = useNavigate();
    document.title = "Kā skaitīt spēles statistiku? | Gandriz NBA";

    // Redirect to the correct instructions page based on the device
    React.useEffect(() => {
        // getGame();
        if ("ontouchstart" in window) {
            navigate("/app/game/" + id + "/instructions/mouse");
        } else {
            navigate("/app/game/" + id + "/instructions/keyboard");
        }
    }, []);

    // Check if game exists
    const getGame = async () => {
        const request = await fetch("http://localhost:8080/api/games/" + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
        });

        const response = await request.json();
        if (response.error || !response[0]) {
            navigate("/app/game/not-found");
        }
    };

    // Show navigation tabs
    return (
        <div className="instructions">
            <h1>Kā skaitīt spēles statistiku?</h1>
            <div className="tabSelector">
                <div>
                    <NavLink
                        to={"/app/game/" + id + "/instructions/keyboard"}
                        relative="path"
                        className="tabSelector_1"
                    >
                        Klavietūra
                    </NavLink>
                </div>
                <div>
                    <NavLink
                        to={"/app/game/" + id + "/instructions/mouse"}
                        relative="path"
                        className="tabSelector_2"
                    >
                        Pele
                    </NavLink>
                </div>
            </div>
            <Outlet />
        </div>
    );
}
