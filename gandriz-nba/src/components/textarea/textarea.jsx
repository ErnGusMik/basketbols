import "./textarea.css";

export default function Textarea(
  inputID,
  label = "",
  value = "",
  placeholder = "",
) {
  return (
    <div className="textarea-container">
      <label htmlFor={inputID}>{label}</label>
      <textarea
        id={inputID}
        name={inputID}
        value={value}
        placeholder={placeholder}
      ></textarea>
    </div>
  );
}
