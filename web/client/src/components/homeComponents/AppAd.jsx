import { useTranslation } from "react-i18next";
import Mob from "../../assets/rb_3865 1.svg";
import "./Style.css";
const AppAd = () => {
  const {t} = useTranslation();
  return (
    <div className="mobile-app-section" id="appad">
      <div className="app-content">
        <div className="app-img">
          <img src={Mob} alt="Mob" />
        </div>
        <div className="app-text">
          <h2>{t("home_app_title")}</h2>
          <p>
            {t("home_app_desc")}
          </p>
          <button className="download-btn">
            {t("home_app_download")}
            <span className="download-icon">↓</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppAd;
