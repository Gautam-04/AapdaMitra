import { Link } from "react-router-dom";
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
            <br />
            <span> {/* <h4>{"AapdaMitra"}</h4> */}</span>An integrated solution
            designed to aid National Disaster Response Force efforts by
            providing real-time data collection from sources like social media,
            news websites, and crowdsourcing and actionable insights.
          </p>
          <Link to={"/login"}>
            <button className="get-started-btn">Get Started</button>
          </Link>
        </div>
        <div className="hero-image-container">
          SIH1687
          <img
            src={Hero}
            alt="AapdaMitra Illustration"
            className="hero-image"
            loading="lazy"
          />
          Real-Time Disaster Information Aggregation System
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
