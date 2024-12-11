import "./Search.css";
import MainLogo from "../../assets/main_logo.svg";

function Search() {
  const [searchbarContent, setSearchbarContent] = useState("");

  const handleSubmit = () => {};
  return (
    <div className="search-page">
      <div className="search-container">
        <img src={MainLogo} alt="Auth Logo" className="header-logo" />

        <div className="search-bar">
          <input type="text" placeholder="Search" className="search-input" />
          <div className="searchbar-submit">
            <button>Search</button>
          </div>
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
