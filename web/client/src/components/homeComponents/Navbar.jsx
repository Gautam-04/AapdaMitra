//import MainLogo from "../../assets/main_logo.svg";
import "./Navbar.css"
function Navbar() {
  return (
    <>
      <div className="nav">
        <div>
          <nav className="header-nav-container">
            <div className="nav-item">HOME</div>
            <div className="nav-item">EVENTS</div>
            <div className="nav-item">ANALYSIS</div>
            <div className="nav-item">NDRF</div>
            <div className="nav-item">CAMPAIGNS</div>
          </nav>
        </div>
        <div>
          <button className="login-btn">LOGIN</button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
