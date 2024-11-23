import NdrfBanner from "../../assets/ndrf_banner.svg"
import MainLogo from "../../assets/main_logo.svg"
import { FaEnvelope, FaPhoneAlt  } from "react-icons/fa";
import './footer.css'
function Footer() {
  return (
    <>
        <div className="banner">
            <img src={NdrfBanner} alt="banner.svg" className="banner_img"/>
        </div>
    <footer className="footer-container">
      <div className="footer-left">
        <img src={MainLogo} alt="mainLogo.svg" />
        <p className="footer-description">
          "AapdaMitra" is a software designed to help government and private agencies by providing real-time data collection from sources like social media, news websites, and open platforms.
        </p>
        <div className="contact-icons">
          <FaEnvelope /> 
          <FaPhoneAlt  /> 
        </div>
      </div>
      <div className="footer-middle">
        <div>
          <h4>General</h4>
          <ul>
            <li>Home</li>
            <li>Events</li>
            <li>Analysis</li>
            <li>NDRF</li>
          </ul>
        </div>
        <div>
          <h4>NDRF</h4>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>
      <div className="footer-right">
        <p>NDRF Helpline Number: +91-9711077372</p>
      </div>
    </footer>
    </>
  )
}

export default Footer