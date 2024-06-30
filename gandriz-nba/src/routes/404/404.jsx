import React from "react";
import { Link } from "react-router-dom";

import "./404.css";
import basketball from "./basketball-white.svg";

const NotFound = () => {
    return (
        <div className="notFound">
            <h1>
                4<img src={basketball} alt="0" />4
            </h1>
            <h2>Mums izskatās ka esi ieradies nepareizajā arēnā...</h2>
            <h3>Mēs neatradām lapu kuru meklēji :-(</h3>
            <Link to="/">
                <button className="toHome">Uz sākumu</button>
            </Link>
            <footer>
                <p>&copy; {new Date().getFullYear()} Gandrīz NBA</p>
            </footer>
        </div>
    );
};

export default NotFound;
