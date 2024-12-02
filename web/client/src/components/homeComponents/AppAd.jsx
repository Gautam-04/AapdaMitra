import Mob from "../../assets/rb_3865 1.svg";
import "./Style.css";
const AppAd = () => {
  return (
    <div className="mobile-app-section">
      <div className="app-content">
        <div className="app-img">
          <img src={Mob} alt="Mob" />
        </div>
        <div className="app-text">
          <h2>Download our Mobile App</h2>
          <p>
            Disaster Preparedness at Your Fingertips Stay connected and informed
            wherever you are with the Aapda Mitra mobile app
          </p>
          <button className="download-btn">
            Download
            <span className="download-icon">↓</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppAd;
