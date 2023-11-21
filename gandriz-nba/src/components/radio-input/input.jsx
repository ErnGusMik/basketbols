import "./input.css";

export default function RadioInput({
  label = "",
  labelSub = "",
  value = [],
  inputID,
}) {
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
            />
            <label htmlFor={item}>{item}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
