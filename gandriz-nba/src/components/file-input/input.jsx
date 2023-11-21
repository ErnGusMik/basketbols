import "./input.css";

export default function FileInput({
  label = "",
  value = "",
  placeholder = "",
  inputID,
  accept = "image/*",
  notes = "",
}) {
  const manageCancel = (e) => {
    e.preventDefault();
    document.getElementById(`${inputID}-warning`).value = "&#9432; Šis lauks ir obligāts";
  };
  return (
    <div className="fileInput-container">
      <label htmlFor={inputID}>{label}</label>
      <input
        type="file"
        id={inputID}
        name={inputID}
        value={value}
        placeholder={placeholder}
        accept={accept}
      />
      <p>{notes}</p>
      <p id={inputID+'-warning'}></p>
    </div>
  );
}
