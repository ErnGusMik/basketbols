import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import Login from "./routes/auth/login/login";
import Email from "./routes/auth/login-email/email";
import Signup from "./routes/auth/signup/signup";
import ForgotPassword from "./routes/auth/forgot-password/forgot-password";
import ResetPassword from "./routes/auth/reset-password/reset-password";

import Root from "./routes/app/root";

import NewTournament from "./routes/app/new-tournament/new-tournament";
import NewTournament2 from "./routes/app/new-tournament/2/new-tournament-2";
import NewTournament3 from "./routes/app/new-tournament/3/new-tournament-3";
import NewTournament4 from "./routes/app/new-tournament/4/new-tournament-4";
import NewTournamentSend from "./routes/app/new-tournament/send/new-tournament-send";

import TournamentNav from "./routes/app/tournament/tournament-nav";

import AboutTournament from "./routes/app/tournament/about/about";
import TournamentTeams from "./routes/app/tournament/teams/teams";
import TournamentStats from "./routes/app/tournament/stats/stats";
import TournamentGames from "./routes/app/tournament/games/games";
import Instructions from "./routes/app/game/pre-game/instructions";
import GameRoot from "./routes/app/game/game-root";
import Keyboard from "./routes/app/game/pre-game/keyboard/keyboard";
import Mouse from "./routes/app/game/pre-game/mouse/mouse";
import Game404 from "./routes/app/game/pre-game/404/game404";
import Game from "./routes/app/game/game/game";
import Analysis from "./routes/app/game/analysis/analysis";
import PublicPage from "./routes/public/public";

import NotFound from "./routes/404/404";
import Watch from "./routes/watch/watch";
import Dashboard from "./routes/app/dashboard/dashboard";
import Settings from "./routes/app/settings/settings";
import Index from "./routes/index";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Index />,
            errorElement: <div>An error occured / Notika kļūda (INDEX-FATAL)</div>,
            children: [],
        },
        {
            path: "/app",
            element: <Root />,
            errorElement: <div>An error occured / Notika kļūda (APP-FATAL)</div>,
            children: [
                {
                    path: "/app/",
                    element: <Dashboard />,
                },
                {
                    path: "/app/settings",
                    element: <Settings />
                },
                {
                    path: "/app/tournaments/new",
                    element: <NewTournament />,
                },
                {
                    path: "/app/tournaments/new/2",
                    element: <NewTournament2 />,
                },
                {
                    path: "/app/tournaments/new/3",
                    element: <NewTournament3 />,
                },
                {
                    path: "/app/tournaments/new/4",
                    element: <NewTournament4 />,
                },
                {
                    path: "/app/tournaments/new/send",
                    element: <NewTournamentSend />,
                },
                {
                    path: "/app/tournaments/:id",
                    element: <TournamentNav />,
                    children: [
                        {
                            path: "/app/tournaments/:id/about",
                            element: <AboutTournament />,
                        },
                        {
                            path: "/app/tournaments/:id/teams",
                            element: <TournamentTeams />,
                        },
                        {
                            path: "/app/tournaments/:id/stats",
                            element: <TournamentStats />,
                        },
                        {
                            path: "/app/tournaments/:id/games",
                            element: <TournamentGames />,
                        },
                    ],
                    errorElement: <div>An error occured / Notika kļūda (TOURNAMENT-FATAL)</div>,
                },
                {
                    path: "/app/game/:id",
                    element: <GameRoot />,
                    children: [
                        {
                            path: "/app/game/:id/instructions",
                            element: <Instructions />,
                            children: [
                                {
                                    path: "/app/game/:id/instructions/keyboard",
                                    element: <Keyboard />,
                                },
                                {
                                    path: "/app/game/:id/instructions/mouse",
                                    element: <Mouse />,
                                },
                            ],
                        },
                        {
                            path: "/app/game/:id/analysis",
                            element: <Analysis />,
                        },

                    ],
                    errorElement: <div>An error occured / Notika kļūda (GAME_ADMIN-FATAL)</div>,
                },
                {
                    path: "/app/game/not-found",
                    element: <Game404 />,
                },
            ],
        },
        {
            path: "/game/:id/play",
            element: <Game />,
        },
        {
            path: "/game/:id/watch",
            element: <Watch />,
            errorElement: <div>An error occured / Notika kļūda (GAME-FATAL)</div>,
        },
        {
            path: "login",
            element: <Login />,
            errorElement: <div>An error occured / Notika kļūda (LOGIN-FATAL)</div>,
        },
        {
            path: "/login/email",
            element: <Email />,
            errorElement: <div>An error occured / Notika kļūda (LOGIN_EMAIL-FATAL)</div>,
        },
        {
            path: "/signup",
            element: <Signup />,
            errorElement: <div>An error occured / Notika kļūda (SIGNUP-FATAL)</div>,
        },
        {
            path: "/forgot-password",
            element: <ForgotPassword />,
            errorElement: <div>An error occured / Notika kļūda (F_PASSW-FATAL)</div>,
        },
        {
            path: "/reset-password",
            element: <ResetPassword />,
            errorElement: <div>An error occured / Notika kļūda (R_PASSW-FATAL)</div>,
        },
        {
            path: "/404",
            element: <NotFound />,
            errorElement: <NotFound />,
        },
        {
            path: '/*',
            element: <PublicPage />,
            errorElement: <div>An error occured / Notika kļūda (PUB_PAGE-FATAL)</div>,
        },
    ]);
    return (
        <div className="App">
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
