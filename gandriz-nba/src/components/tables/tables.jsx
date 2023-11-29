import React from "react";
import "./tables.css";

export default function Table({ cols = [], content = [] }) {
  return (
    <table className="table">
      <thead>
        <tr>
          {cols.map((col, index) => (
            <th key={index}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {content.map((row, index) => (
          <tr key={index}>
            {row.map((cell, index) => (
              <td key={index}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
