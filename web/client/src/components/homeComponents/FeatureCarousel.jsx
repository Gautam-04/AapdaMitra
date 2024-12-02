import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import dashboard from "../../assets/rb_2552 1.png";
import bulk from "../../assets/rb_2385 1.png";
import crowd from "../../assets/rb_108 1.png";
import pig from "../../assets/16482627_5764323 1.png";
import verf from "../../assets/1988196_256429-P4R90V-522 1.png";
import dis from "../../assets/21118602_6428509 1.png";
import "./Style.css";

function FeatureCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} className="car">
      <Carousel.Item>
        <div className="content">
          <div className="left">
            <Carousel.Caption>
              <h3>Realtime Dashboard</h3>
              <p>
                Stay informed with live updates and insights into disaster
                situations through an interactive and dynamic interface.
              </p>
              <div>
                <h2>Learn More</h2>
              </div>
            </Carousel.Caption>
          </div>
          <div className="right">
            <img src={dashboard} alt="dashboard" />
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="content">
          <div className="left">
            <Carousel.Caption>
              <h3>Bulk Post Summarization</h3>
              <p>
                Quickly digest large volumes of disaster-related posts into
                actionable summaries.
              </p>
              <div>
                <h2>Learn More</h2>
              </div>
            </Carousel.Caption>
          </div>
          <div className="right">
            <img src={bulk} alt="dashboard" />
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="content">
          <div className="left">
            <Carousel.Caption>
              <h3>Crowdsourced Data</h3>
              <p>
                Leverage real-time data contributions from the community to
                improve situational awareness and response.
              </p>
              <div>
                <h2>Learn More</h2>
              </div>
            </Carousel.Caption>
          </div>
          <div className="right">
            <img src={crowd} alt="dashboard" />
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="content">
          <div className="left">
            <Carousel.Caption>
              <h3>Fundraiser Management</h3>
              <p>
                Organize, track, and promote donation campaigns with ease to
                maximize impact.
              </p>
              <div>
                <h2>Learn More</h2>
              </div>
            </Carousel.Caption>
          </div>
          <div className="right">
            <img src={pig} alt="dashboard" />
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="content">
          <div className="left">
            <Carousel.Caption>
              <h3>Verification Pipeline</h3>
              <p>
                Ensure the accuracy and reliability of incoming data with an
                automated verification system.
              </p>
              <div>
                <h2>Learn More</h2>
              </div>
            </Carousel.Caption>
          </div>
          <div className="right">
            <img src={verf} alt="dashboard" />
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="content">
          <div className="left">
            <Carousel.Caption>
              <h3>Disaster Analysis and Visualization</h3>
              <p>
                Gain deeper insights through advanced analytics and visual
                representations of disaster trends.
              </p>
              <div>
                <h2>Learn More</h2>
              </div>
            </Carousel.Caption>
          </div>
          <div className="right">
            <img src={dis} alt="dashboard" />
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default FeatureCarousel;
