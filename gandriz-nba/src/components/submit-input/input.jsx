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
        {includeBack && (
          <button
            id={backInputID}
            onClick={onBackClick}
            className="btn backBtn"
          >
            {backValue}
          </button>
        )}
        <input
          type="submit"
          value={value}
          id={inputID}
          onClick={onClick}
          className="btn primaryBtn"
        />
      </div>
    </div>
  );
}
