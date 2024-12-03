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
// import Fundraiser from "./pages/Fundraiser/Fundraiser";
import { io } from "socket.io-client";
import { useEffect } from "react";
import CornerMenu from "./components/cornerMenu/CornerMenu";

function App() {
  const navigate = useNavigate();

  // const socket = io();
  // useEffect(() => {
  //   socket.on("newSos", (x) => {
  //     console.log(x);
  //   });
  // });
  return (
    <>
      {/* <Header /> */}
      {/* <CornerMenu /> */}
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/elastic" element={<ElasticSearch />} />
        <Route path="/event" element={<CardContainer />} />
        <Route path="/verifyposts" element={<VerifyPosts />} />
        <Route path="/summarizeposts" element={<SummarizePosts />} />
        {/* <Route path="/fundraising" element={<Fundraiser />} /> */}
        <Route path="/donations/:fundraiserId" element={<Donation />} />
        <Route path="/dashboard/:tab" element={<Dashboard />} />
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
