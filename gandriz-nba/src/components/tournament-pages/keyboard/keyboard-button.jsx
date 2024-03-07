import React from "react";

import "./keyboard-button.css";

export default function KeyboardBtn({
    text,
    caption,
    small,
    gray,
    onClick = () => {},
    pointer,
    id = '',
}) {
    // React.useEffect(() => {
    //     document.getElementById("keyboardBtn-" + text + small).addEventListener('click', onClick);
    //     return () => {
    //         document.getElementById("keyboardBtn-" + text + small).removeEventListener('click', onClick);
    //     }
    // }, [onClick, text, small]);
    return (
        <div
            className="keyboardBtn__cont"
            onContextMenu={(e) => e.preventDefault()}
        >
            <div
                className={
                    small
                        ? gray
                            ? "keyboardBtn keyboardBtn__small keyboardBtn__gray"
                            : "keyboardBtn keyboardBtn__small"
                        : gray
                        ? "keyboardBtn keyboardBtn__darkGray"
                        : "keyboardBtn"
                }
                onMouseDown={onClick}
                style={pointer ? { cursor: "pointer" } : {}}
                id={id ? id : ''}
            >
                <h2>{text}</h2>
            </div>
            {caption && <p>{caption}</p>}
        </div>
    );
}
