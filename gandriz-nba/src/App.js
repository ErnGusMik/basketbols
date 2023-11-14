import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./routes/auth/login/login";
import Email from "./routes/auth/login-email/email";
import Signup from "./routes/auth/signup/signup";
import ForgotPassword from "./routes/auth/forgot-password/forgot-password";

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
      element: <div>App</div>,
      errorElement: <div>App error</div>,
      children: [],
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
      errorElement: <div>Not found error</div>,
      children: [],
    }
  ]);
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
