import { Link } from "react-router-dom";
import Hero from "../../assets/Untitled-1 1.svg";
import MainLogo from "../../assets/main_logo.svg";
import "./Style.css";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const {t} = useTranslation();
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-logo-container">
            <img src={MainLogo} alt="AapdaMitra Logo" className="hero-logo" />
          </div>
          <h1 className="hero-title"></h1>
          <p className="hero-description">
            <br />
            <span> {/* <h4>{"AapdaMitra"}</h4> */}</span>{t("header_hero_description")}
          </p>
          <Link to={"/login"}>
            <button className="get-started-btn">{t("header_home_getStarted")}</button>
          </Link>
        </div>
        <div className="hero-image-container">
          {t("header_sih_title")}
          <img
            src={Hero}
            alt="AapdaMitra Illustration"
            className="hero-image"
            loading="lazy"
          />
          {t("header_sih_description")}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
