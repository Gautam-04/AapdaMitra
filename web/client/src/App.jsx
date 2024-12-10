import { Route, Routes, useNavigate } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./pages/Auth/SignUp";
import SignIn from "./pages/Auth/SignIn";
import Home from "./pages/Home/Home";
import "leaflet/dist/leaflet.css";
import Footer from "./components/footer/Footer";
import Header from "./components/header/header";
import CardContainer from "./components/cardContainer/cardContainer";
import Searchbar from "./components/searchbar/searchbar";
import MultiTabContainer from "./components/multitabContainer/multiTabContainer";
import ElasticSearch from "./pages/ElasticSearch/ElasticSearch";
import VerifyPosts from "./pages/VerifyPosts/VerifyPosts";
import Donation from "./pages/Donation/Donation";
import SummarizePosts from "./pages/SummarizePosts/SummarizePosts";
import Dashboard from "./pages/Dashboard/Dashboard";
import Search from "./components/Search/Search";
import Navigator from "./pages/Navigator/Navigator";
// import Fundraiser from "./pages/Fundraiser/Fundraiser";

function App() {
  const navigate = useNavigate();

  return (
    <>
      {/* <Header /> */}
      {/* <CornerMenu /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/dashboard/:tab" element={<Dashboard />} />
        <Route path="/donations/:fundraiserId" element={<Donation />} />
        <Route path="/elastic" element={<ElasticSearch />} />
        {/* <Route path="/search" element={<Search />} /> */}
        {/* <Route path="/event" element={<CardContainer />} /> */}
        <Route path="/verifyposts" element={<VerifyPosts />} />
        <Route path="/summarizeposts" element={<SummarizePosts />} />
        {/* <Route path="/fundraising" element={<Fundraiser />} /> */}
        <Route path="/donations/:fundraiserId" element={<Donation />} />
        <Route path="/dashboard/:tab" element={<Dashboard />} />
        <Route path="/navigation" element={<Navigator />} />
      </Routes>
      {/* <Footer /> */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </>
  );
}

export default App;
