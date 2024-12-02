import Hero from "../../assets/Untitled-1 1.svg";
import MainLogo from "../../assets/main_logo.svg";
import "./Style.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-logo-container">
            <img src={MainLogo} alt="AapdaMitra Logo" className="hero-logo" />
          </div>
          <h1 className="hero-title"></h1>
          <p className="hero-description">
            <span>
              {" "}
              <h4>{"AapdaMitra"}</h4>
            </span>
            A software designed to help government and private agencies by
            providing real-time data collection from sources like social media,
            news websites, and open platforms.
          </p>
          <button className="get-started-btn">Get Started</button>
        </div>
        <div className="hero-image-container">
          <img
            src={Hero}
            alt="AapdaMitra Illustration"
            className="hero-image"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
