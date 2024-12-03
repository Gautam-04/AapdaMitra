//import ndrf from "../../assets/ndrf_logo.svg";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
function Navbar() {
  return (
    <>
      <div className="nav">
        <div>
          <nav className="header-nav-container">
            <div className="nav-item">FEATURES</div>
            <div className="nav-item">APP</div>
            <div className="nav-item">GALLERY</div>
            <div className="nav-item">NDRF</div>
          </nav>
        </div>
        <div>
          <Link to={"/"}>
            <button className="login-btn">LOGIN</button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;
