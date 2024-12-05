//import ndrf from "../../assets/ndrf_logo.svg";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { Dropdown } from "react-bootstrap";
import i18next from "i18next";
function Navbar() {
  const languages = [
    { code: "en", Lang: "English" },
    { code: "hi", Lang: "Hindi" },
  ];
  return (
    <>
      <div className="nav">
        <div>
          <nav className="header-nav-container">
            <div className="nav-item">
              <a href="#features">FEATURES</a>
            </div>
            <div className="nav-item">
              <a href="#appad">APP</a>
            </div>
            <div className="nav-item">
              <a href="#gallery">GALLERY</a>
            </div>
            <div className="nav-item">
              <a href="https://ndrf.gov.in">NDRF</a>
            </div>
          </nav>
        </div>
        <div className="home-nav-right">
          <Dropdown className="change-language">
            <Dropdown.Toggle id="dropdown-basic">
              Change Language
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
            <button className="login-btn">LOGIN</button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;
