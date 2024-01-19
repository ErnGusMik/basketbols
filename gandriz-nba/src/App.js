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

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Home</div>,
      errorElement: <div>Home error</div>,
      children: [],
    },
    {
      path: "/app",
      element: <Root />,
      errorElement: <div>App error</div>,
      children: [
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
      ],
    },
    {
      path: "login",
      element: <Login />,
      errorElement: <div>Login error</div>,
      children: [],
    },
    {
      path: "/login/email",
      element: <Email />,
      errorElement: <div>Login email error</div>,
      children: [],
    },
    {
      path: "/signup",
      element: <Signup />,
      errorElement: <div>Signup error</div>,
      children: [],
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
      errorElement: <div>Forgot password error</div>,
      children: [],
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
      errorElement: <div>Reset password error</div>,
      children: [],
    },
  ]);
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
