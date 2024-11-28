import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/Footer";
import "./VerifyPosts.css";
import EventCard from "../../components/eventCard/EventCard";

const VerifyPosts = (props) => {
  const posts = useLocation();
  useEffect(() => {
    Object.values(posts.state.posts).map((post, idx) => {
      console.log(post, idx);
    });
    console.log(Object.keys(posts.state.posts).length);
  });
  return (
    <div>
      <Header />
      <div className="verify-cards-wrapper">
        <div className="verify-cards-container">
          {Object.values(posts.state.posts).map((post, idx) => {
            return (
              <div key={idx} className="verify-card-container">
                <EventCard data={post} />
                <textarea name="" id="" value={"Verified By NDRF"}></textarea>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VerifyPosts;
