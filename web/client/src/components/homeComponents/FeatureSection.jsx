import "./Style.css";
import book from "../../assets/book.svg";
import people from "../../assets/people.svg";
import shield from "../../assets/shield-tick.svg";
import group from "../../assets/Group.svg";
import doc from "../../assets/document.svg";
import chart from "../../assets/chart.svg";
import { useTranslation } from "react-i18next";
const features = [
  {
    title: "Realtime Dashboard",
    source: doc,
  },
  {
    title: "Bulk Post Summarization",
    source: people,
  },
  {
    title: "Crowdsourced Data",
    source: book,
  },
  {
    title: "Fundraiser Management",
    source: group,
  },
  {
    title: "Verification Pipeline",
    source: shield,
  },
  {
    title: "Disaster Analysis and Visualization",
    source: chart,
  },
];

const FeatureSection = () => {

  const {t} = useTranslation();
  return (
    <div className="features-section">
      <h2>{t("home_feature_title")}</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <img src={feature.source} alt={feature.source} className="icons" />
            <h3>{feature.title}</h3>
            {/* <button className="learn-more-btn">Learn more</button> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
