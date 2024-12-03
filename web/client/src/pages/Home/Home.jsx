import Footer from "../../components/footer/Footer";
import AppAd from "../../components/homeComponents/appAd";
import FeatureCarousel from "../../components/homeComponents/FeatureCarousel";
import FeatureSection from "../../components/homeComponents/FeatureSection";
import GovtLogos from "../../components/homeComponents/GovtLogos";
import HeroSection from "../../components/homeComponents/HeroSection";
import Navbar from "../../components/homeComponents/Navbar";
import PhotoGallery from "../../components/homeComponents/PhotoGallery";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      <HeroSection />
      <div className="latest-news-section" id="features">
        {/* <h2 style={{ fontFamily: "'Inter', sans-serif" }}>Latest News</h2> */}
        <marquee>
          <span>Saving Lives & Beyond “आपदा सेवा सदैव सर्वत्र”</span>
          <span>NDRF Helpline Number : +91-9711077372</span>
          <span>Saving Lives & Beyond “आपदा सेवा सदैव सर्वत्र”</span>
          <span>NDRF Helpline Number : +91-9711077372</span>
        </marquee>
      </div>
      <FeatureSection />
      <FeatureCarousel />
      <AppAd />
      <PhotoGallery />
      <GovtLogos />
      <Footer />
    </div>
  );
};

export default Home;
