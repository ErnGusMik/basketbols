import React from "react";
import "./tables.css";

export default function Table({
  cols = [],
  content = [],
  setColWidth = false,
}) {
  return (
    <table className="table">
      <thead>
        <tr>
          {cols.map((col, index) => (
            <th key={index} style={setColWidth ? {width: setColWidth} : {}}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {content.map((row, index) => (
          <tr key={index}>
            {row.map((cell, index) => (
              <td
                key={index}
                style={setColWidth ? {width: setColWidth} : {}}
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
