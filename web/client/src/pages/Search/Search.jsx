import './Search.css'; 
import MainLogo from '../../assets/main_logo.svg';

function Search() {
  return (
    <div className="search-page">
      <div className="header">
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

      
      <div className="search-container">
        <img src={MainLogo} alt="Auth Logo" className="header-logo" />

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
          />
        </div>

        
        <div className="disaster-buttons">
          <button className="button">Floods</button>
          <button className="button">Earthquakes</button>
          <button className="button">Landslide</button>
          <button className="button">Tsunami</button>
          <button className="button">Drought</button>
        </div>
      </div>
    </div>
  );
}

export default Search;
