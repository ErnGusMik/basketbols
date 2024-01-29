import React from "react";

import "./main-image.css";

export default function MainImage({ titleData }) {
  const [fontSize, setFontSize] = React.useState("4rem");

  const calculateLength = () => {
    if (titleData.length > 20) {
      titleData = titleData.substring(0, 20) + "...";
    } else {
      titleData = titleData;
    }
  };

  React.useEffect(() => {
    calculateLength();
  }, []);

  return (
    <div className="mainImage">
      <div className="mainImageOverlay">
        <h1>{titleData}</h1>
      </div>
    </div>
  );
}
