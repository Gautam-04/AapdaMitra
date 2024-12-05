//import ndrf from "../../assets/ndrf_logo.svg";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { Dropdown } from "react-bootstrap";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
function Navbar() {
  const languages = [
    { code: "en", Lang: "English" },
    { code: "hi", Lang: "हिन्दी" },
    { code: "mr", Lang: "मराठी" },
    { code: "odia", Lang: "ଓଡ଼ିଆ" },
    { code: "bangla", Lang: "বাংলা" },
  ];

  const {t} = useTranslation();
  return (
    <>
      <div className="nav">
        <div>
          <nav className="header-nav-container">
            <div className="nav-item">
              <a href="#features">{t("header_nav_features")}</a>
            </div>
            <div className="nav-item">
              <a href="#appad">{t("header_nav_app")}</a>
            </div>
            <div className="nav-item">
              <a href="#gallery">{t("header_nav_gallery")}</a>
            </div>
            <div className="nav-item">
              <a href="https://ndrf.gov.in">{t("header_nav_ndrf")}</a>
            </div>
          </nav>
        </div>
        <div className="home-nav-right">
          <Dropdown className="change-language">
            <Dropdown.Toggle id="dropdown-basic">
              {t("header_nav_changeLang")}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {languages.map((language) => (
                <Dropdown.Item
                  key={language.code}
                  onClick={() => i18next.changeLanguage(language.code)}
                >
                  {language.Lang}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Link to={"/login"}>
            <button className="login-btn">{t("header_nav_login")}</button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;
