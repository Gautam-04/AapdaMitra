import { Route, Routes } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./pages/Auth/SignUp";
import SignIn from "./pages/Auth/SignIn";
import Home from "./pages/Home/Home";
// import Footer from "./components/footer/Footer";
// import Header from "./components/header/header";
import Search from "./pages/Search/Search";
import CardContainer from "./components/cardContainer/cardContainer";
import Searchbar from "./components/searchbar/searchbar";

function App() {
  return (
    <>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route
          path="/test"
          element={
            <>
              <Header />
              <Searchbar />
              <Footer />
            </>
          }
        />
        <Route path="/event" element={<CardContainer />} />
      </Routes>
      {/* <Footer /> */}
      <Routes></Routes>
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
