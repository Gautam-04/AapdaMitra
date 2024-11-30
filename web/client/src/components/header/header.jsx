import { Link } from "react-router-dom";
import MainLogo from "../../assets/main_logo.svg";
import Dropdown from 'react-bootstrap/Dropdown';
import "./header.css";
import { changeLanguage } from "i18next";
import { useTranslation } from "react-i18next";

function Header() {

  const {i18n} = useTranslation()

  const languages = [
    {code: "en",Lang: "English"},
    {code: "hi", Lang: "Hindi"}
  ]

  return (
    <div className="header">
      <div className="header-logo-container">
        <Link
          to={"/dashboard"}
          style={{ textDecoration: "None", color: "black" }}
        >
          <img src={MainLogo} alt="mainlogo.svg" className="header-logo" />
        </Link>
      </div>

      <nav className="header-nav-container">
        <div className="header-nav-item">
          <Link
            to={"/dashboard"}
            style={{ textDecoration: "None", color: "black" }}
          >
            HOME
          </Link>
        </div>
        <div className="header-nav-item">
          <Link
            to={"/elastic"}
            style={{ textDecoration: "None", color: "black" }}
          >
            SEARCH
          </Link>
        </div>
        <div className="header-nav-item">
          <Link
            to={"/donations/:0"}
            style={{ textDecoration: "None", color: "black" }}
          >
            DONATIONS
          </Link>{" "}
        </div>
        <div className="header-nav-item">
          <Link
            to={"https://www.ndrf.gov.in/"}
            style={{ textDecoration: "None", color: "black" }}
          >
            NDRF
          </Link>{" "}
        </div>
      </nav>

      <div className="header-right-section">
        <div className="header-profile-container">
          <img
            src="https://avatar.iran.liara.run/public/boy?username=Ash"
            alt="Profile Icon"
            className="header-profile-image"
          />
        </div>
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic">Change Language</Dropdown.Toggle>

          <Dropdown.Menu>
            {languages.map((language) => (
              <Dropdown.Item
                key={language.code}
                onClick={() => i18n.changeLanguage(language.code)}
              >
                {language.Lang}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default Header;
