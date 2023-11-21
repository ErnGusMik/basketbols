import "./input.css";

export default function TextInput({
  label = "",
  value = "",
  placeholder = "",
  inputID,
  type = "text",
}) {
  return (
    <div className="textInput-container">
      <label htmlFor={inputID}>{label}</label>
      <input type={type} id={inputID} name={inputID} value={value} placeholder={placeholder} />
    </div>
  );
}
