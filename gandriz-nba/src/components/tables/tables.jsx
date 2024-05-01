import React from "react";
import "./tables.css";

export default function Table({
  cols = [],
  content = [],
  setColWidth = false,
  id = "",
  pubTable = false,
}) {
  return (
    <table className="table" id={id}>
      <thead>
        <tr>
          {cols.map((col, index) => (
            <th
              key={index}
              style={
                setColWidth
                  ? { width: setColWidth }
                  : pubTable
                    ? { backgroundColor: "#EE6730", color: "#000" }
                    : {}
              }
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
                  setColWidth
                    ? { width: setColWidth }
                    : pubTable
                      ? {
                          backgroundColor: "#fff",
                          color: "#000",
                          fontWeight: 500,
                        }
                      : {}
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
