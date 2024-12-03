//import ndrf from "../../assets/ndrf_logo.svg";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
function Navbar() {
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
        <div>
          <Link to={"/login"}>
            <button className="login-btn">LOGIN</button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;
