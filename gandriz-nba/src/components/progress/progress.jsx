import "./progress.css";

export default function Progress({ progress = 1 }) {
  const circle2 = progress >= 2 ? "progressCircle-active" : "";
  const circle3 = progress >= 3 ? "progressCircle-active" : "";
  const circle4 = progress >= 4 ? "progressCircle-active" : "";
  return (
    <div className="progressCont">
      <div className="progress">
        <div className="progressSection">
          <div className="progressCircle progressCircle-active">
            <i className="fa-solid fa-circle-info" />
          </div>
          <p className="progressText">Turnīra info</p>
        </div>
        <div className="progressLine" />
        <div className="progressSection">
          <div className={"progressCircle " + circle2}>
            <i className="fa-solid fa-people-group" />
          </div>
          <p className="progressText">Komandas</p>
        </div>
        <div className="progressLine" />
        <div className="progressSection">
          <div className={"progressCircle " + circle3}>
            <i className="fa-solid fa-scale-balanced" />
          </div>
          <p className="progressText">Tiesneši</p>
        </div>
        <div className="progressLine" />

        <div className="progressSection">
          <div className={"progressCircle " + circle4}>
            <i className="fa-solid fa-gamepad" />
          </div>
          <p className="progressText">Spēles</p>
        </div>
      </div>
    </div>
  );
}
