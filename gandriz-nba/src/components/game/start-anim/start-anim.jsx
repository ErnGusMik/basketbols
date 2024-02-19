import React from "react";

import "./start-anim.css";

export default function StartAnimation({ start = false }) {
    // Set states
    const [go, setGo] = React.useState(false);
    const [secondValue, setSecondValue] = React.useState(10);

    React.useEffect(() => {
        if (start) {
            document.querySelector('.anim__container').style.display = 'flex';
            const interval = setInterval(() => {
                document.querySelector(".main").classList.add("fade");

                setSecondValue((prev) => prev - 1);

                setTimeout(() => {
                    document.querySelector(".main").classList.remove("fade");
                }, 500);
            }, 1000);
            setTimeout(() => {
                clearInterval(interval);

                document.querySelector(".main").classList.add("fade");

                setSecondValue("Aiziet");

                setTimeout(() => {
                    setGo(true);

                    document.getElementById("outline-top").style.transform =
                        "translateY(100%)";

                    document.getElementById("outline-bottom").style.transform =
                        "translateY(-100%)";

                    document.querySelector(".main").classList.remove("fade");
                    document
                        .querySelector("#outline-top")
                        .classList.add("to-top");

                    document
                        .querySelector("#outline-bottom")
                        .classList.add("to-bottom");

                    setTimeout(() => {
                        document.querySelector('.anim__container').style.display = 'none';
                    }, 2200);
                }, 600);
            }, 10000);
        }
    }, [start]);

    return (
        <div className="anim__container">
            <div className="faded__backg">
                <div className="backg"></div>
            </div>
            <h1 className="main__outline" id="outline-top">
                {go ? "Aiziet" : ""}
            </h1>
            <h1 className="main">{secondValue}</h1>
            <h1 className="main__outline" id="outline-bottom">
                {go ? "Aiziet" : ""}
            </h1>
        </div>
    );
}
