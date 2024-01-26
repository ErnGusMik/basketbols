import React from "react";

import "./main-image.css";

export default function MainImage({ titleData }) {
    const [fontSize, setFontSize] = React.useState("4rem");
    const [title, setTitle] = React.useState(titleData);

    const calculateFontSize = () => {
        const titleLength = title.length;

        if (titleLength < 20) {
            return "4rem";
        } else if (titleLength <= 30) {
            return "3rem";
        } else {
            setTitle(titleData.substring(0, 29) + "...");
            return "3rem";
        }
    };

    React.useEffect(() => {
        const size = calculateFontSize();
        setFontSize(size);
    }, []);

    return (
        <div className="mainImage">
            <div className="mainImageOverlay">
                <h1 style={{ fontSize: fontSize }}>{title}</h1>
            </div>
        </div>
    );
}
