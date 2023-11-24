import React from "react";
import "./input.css";

export default function RadioInput({
  label = "",
  labelSub = "",
  value = [],
  valueSub = [],
  inputID,
  error = "",
}) {
  const errorhandler = () => {
    if (value.length == 0) {
      console.log('error');
      document.getElementById('radio-error').classList.add('error-show');
    }
  }
  React.useEffect(() => {
    errorhandler();
  }, []);
  return (
    <div className="radioInput-container">
      <label htmlFor={inputID} className="main-label">{label}</label>
      <p className="label-sub">{labelSub}</p>
      <div className="radio-cont">
        {value.map((item, index) => (
          <div className="radio-item" id={'radio-item'+index}>
            <input
              type="radio"
              id={inputID+'-'+index}
              name={inputID}
              value={item}
              onChange={errorhandler}
            />
            <label htmlFor={inputID+'-'+index}>
              <span className="labelButton">
                {item}
              </span>
              <p>{valueSub[index]}</p>
            </label>
          </div>
        ))}
      </div>
      <p className="error" id="radio-error">{error}</p>
    </div>
  );
}
