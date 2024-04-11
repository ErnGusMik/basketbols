import "./textarea.css";

export default function Textarea({
  inputID = "",
  label = "",
  placeholder = "",
  required = false,
}) {
  return (
    <div className="textarea-container">
      <label htmlFor={inputID}>{label}</label>
      <textarea
        id={inputID}
        name={inputID}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
