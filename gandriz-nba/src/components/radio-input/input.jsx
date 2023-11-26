import React from "react";
import "./input.css";

export default function RadioInput({
  label = "",
  labelSub = "",
  value = [],
  valueSub = [],
  inputID,
  error = "",
  onChange = () => {},
}) {
  const errorhandler = () => {
    if (value.length == 0) {
      document.getElementById(inputID + "-error").classList.add("error-show");
    } else {
      document
        .getElementById(inputID + "-error")
        .classList.remove("error-show");
    }
  };
  React.useEffect(() => {
    errorhandler();
  }, [value]);
  return (
    <div className="radioInput-container">
      <label htmlFor={inputID} className="main-label">
        {label}
      </label>
      <p className="label-sub">{labelSub}</p>
      <div className="radio-cont">
        {value.map((item, index) => (
          <div className="radio-item" id={"radio-item" + index}>
            <input
              type="radio"
              id={inputID + "-" + index}
              name={inputID}
              value={item}
              onChange={onChange}
            />
            <label htmlFor={inputID + "-" + index}>
              <span className="labelButton">{item}</span>
              <p className="value-subheading">{valueSub[index]}</p>
            </label>
          </div>
        ))}
      </div>
      <p className="error error-show" id={inputID + "-error"}>
        {error}
      </p>
    </div>
  );
}
