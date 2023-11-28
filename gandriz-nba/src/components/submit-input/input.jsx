import "./input.css";

export default function SubmitInput({
  value = "Turpināt",
  includeBack = false,
  backValue = "Atpakaļ",
  inputID,
  backInputID = "",
  onClick = function () {},
  onBackClick = function () {},
}) {
  return (
    <div className="flexCont">
      <div className="submitInput-container">
        <input
          type="submit"
          value={value}
          id={inputID}
          onClick={onClick}
          className="btn primaryBtn"
        />
        {includeBack && (
          <input
            type="button"
            value={backValue}
            id={backInputID}
            onClick={onBackClick}
            className="btn"
          />
        )}
      </div>
    </div>
  );
}
