import React from "react";
import "./root.css";
import {
    Outlet,
    Link,
    useNavigate,
    useLocation,
    NavLink,
} from "react-router-dom";

export default function Root() {
    const navigate = useNavigate();
    const location = useLocation();

    const [tournaments, setTournaments] = React.useState([]);
    const [breadcrumbs, setBreadcrumbs] = React.useState("Sākums");
    const [lang, setLang] = React.useState(
        Boolean(localStorage.getItem("lang"))
    );

    // Change languege
    const changeLanguage = () => {
        if (localStorage.getItem("lang") === "en") {
            localStorage.removeItem("lang");
            window.dispatchEvent(new Event("storage"));
            setLang(false);
            return;
        }
        localStorage.setItem("lang", "en");
        window.dispatchEvent(new Event("storage"));
        setLang(true);
    };

    // Parse JWT token
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

    // Set width of text
    const setWidth = (text) => {
        if (text.length > 11) {
            return text.substring(0, 10) + "...";
        }
        return text;
    };

    let menuOpen = false;

    const showMenu = () => {
        if (!menuOpen) {
            document.querySelector(".verticalNav-main").style.left = "0px";
            document.querySelector(".verticalNav-overlay").style.visibility =
                "visible";
            document.querySelector(".verticalNav-overlay").style.opacity = "1";
            menuOpen = true;
        } else {
            document.querySelector(".verticalNav-main").style.left = "-300px";
            document.querySelector(".verticalNav-overlay").style.visibility =
                "hidden";
            document.querySelector(".verticalNav-overlay").style.opacity = "0";
            menuOpen = false;
        }
    };

    // Check if user is logged in
    const loggedIn = () => {
        const accessToken = localStorage.getItem("access_token");
        const idToken = localStorage.getItem("id_token");
        const refreshToken = localStorage.getItem("refresh_token");
        if (!accessToken || !idToken || !refreshToken) {
            console.log("User is not logged in");
            return false;
        }
        return true;
    };

    const getTournaments = async () => {
        const idToken = parseJwt(localStorage.getItem("id_token"));
        const userID = idToken.sub;
        // Make request to get tournaments with specific userID
        const request = await fetch(
            "https://basketbols.onrender.com/api/" + userID + "/tournaments",
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

        const response = await request.json();

        setTournaments(response);
        return;
    };

    // Set breadcrumbs
    const setBreadcrumbsContent = () => {
        // If /app set breadcrumbs to "Sākums"
        if (location.pathname === "/app") {
            setBreadcrumbs(lang ? 'Dashboard' : "Sākums");

            // If new tournament set breadcrumbs to "Jauns turnīrs"
        } else if (location.pathname.includes("/app/tournaments/new")) {
            setBreadcrumbs(lang ? 'New tournament' : "Jauns turnīrs");

            // If tournament page is open set to name of tournament
        } else if (location.pathname.includes("/app/tournaments/")) {
            // Get tournament ID from URL
            const tournamentID = location.pathname.split("/")[3];
            if (!tournamentID) return;

            // Find tournament with specific ID from state
            const tournament = tournaments.find(
                (tournament) => tournament.id === Number(tournamentID)
            );

            // If tournament is not found set breadcrumbs to "Turnīrs", else set to name of tournament
            if (!tournament) {
                setBreadcrumbs(lang ? 'Tournament' : "Turnīrs");
                return;
            }
            setBreadcrumbs(tournament.name);

            // If settings page is open set breadcrumbs to "Iestatījumi"
        } else if (location.pathname.includes("/app/settings")) {
            setBreadcrumbs(lang ? 'Settings' : "Iestatījumi");
        }
    };

    React.useEffect(() => {
        if (!loggedIn()) {
            navigate("/login");
            return;
        }
        getTournaments();
    }, []);

    // On location change and tournaments update set breadcrumbs
    React.useEffect(() => {
        setBreadcrumbsContent();
    }, [location.pathname, tournaments]);

    return (
        <div className="root">
            <i
                className="fa-solid fa-globe changeLang"
                style={{ color: "black", zIndex: 10 }}
                onClick={changeLanguage}
            />
            <div className="verticalNav-overlay" />
            <div className="verticalNav-menuButton" onClick={showMenu}>
                <i className="fa-solid fa-bars-staggered" />
            </div>
            <div className="horizontalNav-main">
                <div className="horizontalNav-logo">
                    <Link to="/app">
                        <img src="x" alt="GandrīzNBA logo" />
                    </Link>
                </div>
                {/* HORIZONTAL BREADCRUMBS */}
                <div className="horizontalNav-breadcrumbs">
                    <i className="fa-solid fa-chevron-right horizontalNav-sign" />
                    <p id="breadcrumbs">{breadcrumbs}</p>
                </div>
            </div>
            <div className="verticalNav-main">
                <div className="verticalNav-content">
                    <div
                        className="verticalNav-menuButtonClose"
                        onClick={showMenu}
                    >
                        <i className="fa-solid fa-xmark" />
                    </div>
                    <div className="verticalNav-home">
                        <NavLink
                            to="/app"
                            className={({ isActive }) =>
                                isActive
                                    ? "verticalNav-active verticalNav-line"
                                    : "verticalNav-line"
                            }
                            end
                            unstable_viewTransition
                        >
                            <i className="fa-solid fa-house" />
                            <p>{lang ? 'Dashboard' : 'Sākums'}</p>
                        </NavLink>
                        <hr />
                    </div>
                    <div className="verticalNav-tournaments">
                        {tournaments.map((tournament) => {
                            return (
                                <NavLink
                                    to={"/app/tournaments/" + tournament.id}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "verticalNav-active verticalNav-line"
                                            : "verticalNav-line"
                                    }
                                    unstable_viewTransition
                                >
                                    <i className="fa-solid fa-basketball" />
                                    <p>{setWidth(tournament.name)}</p>
                                </NavLink>
                            );
                        })}
                        <NavLink
                            to="/app/tournaments/new"
                            className={({ isActive }) =>
                                isActive
                                    ? "verticalNav-active verticalNav-line"
                                    : "verticalNav-line"
                            }
                            unstable_viewTransition
                        >
                            <i className="fa-solid fa-plus" />
                            <p>{lang ? 'New tourna...' : 'Jauns turnīrs'}</p>
                        </NavLink>
                    </div>
                </div>
                <NavLink
                    to="/app/settings"
                    className={({ isActive }) =>
                        isActive
                            ? "verticalNav-active verticalNav-line verticalNav-settings"
                            : "verticalNav-line verticalNav-settings"
                    }
                    end
                    unstable_viewTransition
                >
                    <i className="fa-solid fa-gear" />
                    <p>{lang ? 'Settings' : 'Iestatījumi'}</p>
                </NavLink>
            </div>
            <div id="mainOutlet">
                <Outlet />
            </div>
        </div>
    );
}
