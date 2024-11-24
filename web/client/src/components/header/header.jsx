import MainLogo from '../../assets/main_logo.svg'; 
import './header.css';

function Header() {
  return (
    <div className="header">
      <div className="header-logo-container">
        <img src={MainLogo} alt="mainlogo.svg" className="header-logo" />
      </div>

      <nav className="header-nav-container">
        <div className="header-nav-item">HOME</div>
        <div className="header-nav-item">ANALYSIS</div>
        <div className="header-nav-item">ABOUT US</div>
        <div className="header-nav-item">NDRF</div>
        <div className="header-nav-item">CAMPAIGNS</div>
      </nav>


      <div className="header-right-section">

        <i className="far fa-bell header-bell" aria-hidden="true"></i>

        <div className="header-profile-container">
          <img
            src="https://via.placeholder.com/46x57"
            alt="Profile Icon"
            className="header-profile-image"
          />
        </div>
      </div>
    </div>
  );
}

export default Header;


