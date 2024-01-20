import React from "react";
import "./tables.css";

export default function Table({
    cols = [],
    content = [],
    setColWidth = false,
    id = "",
}) {
    
    return (
        <table className="table" id={id}>
            <thead>
                <tr>
                    {cols.map((col, index) => (
                        <th
                            key={index}
                            style={setColWidth ? { width: setColWidth } : {}}
                        >
                            {col}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {content.map((row, index) => (
                    <tr key={index} id={id + "-row-" + index}>
                        {row.map((cell, indx) => (
                            <td
                                key={indx}
                                style={
                                    setColWidth ? { width: setColWidth } : {}
                                }
                                id={id + "-row-" + index + "-cell-" + indx}
                            >
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
