import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import dashboard from "../../assets/rb_2552 1.png";
import bulk from "../../assets/rb_2385 1.png";
import crowd from "../../assets/rb_108 1.png";
import pig from "../../assets/16482627_5764323 1.png";
import verf from "../../assets/1988196_256429-P4R90V-522 1.png";
import dis from "../../assets/21118602_6428509 1.png";
import "./Style.css";
import { useTranslation } from "react-i18next";

const carouselItems = [
  {
    title: "Realtime Dashboard",
    description:
      "Stay informed with live updates and insights into disaster situations through an interactive and dynamic interface.",
    image: dashboard,
  },
  {
    title: "Bulk Post Summarization",
    description:
      "Quickly digest large volumes of disaster-related posts into actionable summaries.",
    image: bulk,
  },
  {
    title: "Crowdsourced Data",
    description:
      "Leverage real-time data contributions from the community to improve situational awareness and response.",
    image: crowd,
  },
  {
    title: "Fundraiser Management",
    description:
      "Organize, track, and promote donation campaigns with ease to maximize impact.",
    image: pig,
  },
  {
    title: "Verification Pipeline",
    description:
      "Ensure the accuracy and reliability of incoming data with an automated verification system.",
    image: verf,
  },
  {
    title: "Disaster Analysis and Visualization",
    description:
      "Gain deeper insights through advanced analytics and visual representations of disaster trends.",
    image: dis,
  },
];

function FeatureCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const {t} = useTranslation();

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} className="car">
      {carouselItems.map((item, idx) => (
        <Carousel.Item key={idx}>
          <div className="content">
            <div className="left">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div>
                <h2>{t("home_learn_more")}</h2>
              </div>
            </div>
            <div className="right">
              <img src={item.image} alt={item.title} />
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default FeatureCarousel;
