import React from "react";

import './main-image.css'

export default function MainImage({ title }) {
    return (
        <div className="mainImage">
            <div className="mainImageOverlay">
                <h1>{title}</h1>
            </div>
        </div>
    )
}