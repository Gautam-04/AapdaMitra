import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/Footer";
import "./VerifyPosts.css";
import EventCard from "../../components/eventCard/EventCard";
import { Button } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { CiLink } from "react-icons/ci";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyPosts = (props) => {
  const incomingPosts = useLocation();
  const [posts, setPosts] = useState(incomingPosts.state.posts);
  const [verifiedPosts, setVerifiedPosts] = useState([]);
  const [postComments, setPostComments] = useState([]);

  const handlePostVerify = async (post, idx) => {
    try {
      console.log(idx, postComments[idx]);
      if (postComments[idx]) {
        var content = postComments[idx];
      } else {
        content = "This post is Verified by NDRF. \n\n AapdaMitra | NDRF Team";
      }
      if (post.source === "Twitter") {
        const formData = new FormData();
        formData.append("content", content);
        formData.append("tweet_id", post.post_id);

        const response = await fetch("http://localhost:5000/twitter/reply", {
          method: "POST",
          body: formData,
        });
        if (response.status === 201) {
          toast.success("Post Verified successfully!");
        }
      } else if (post.source === "AapdaMitra App") {
        const toSend = {
          title: post.post_title,
          body: post.post_body,
          location: post.location,
          date: post.date,
          type: post.disaster_type,
          source: post.source,
          postId: post._id,
          priority: "",
        };

        const response = await axios.post("/api/v1/mobile/add-post", toSend, {
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 201) {
          toast.success("Post Verified successfully!");
        }
      }
    } catch (error) {
      toast.error("Error verifying post. Try again later.");
      console.error(error);
    }
  };

  const handleTextAreaChange = (e, idx) => {
    var temp = postComments;
    temp[idx] = e.target.value;
    setPostComments(temp);
    console.log(postComments);
  };

  const handlePostRemove = (post, idx) => {
    console.log(idx);
    setPosts((prevPosts) => prevPosts.filter((e) => e !== post));
  };

  useEffect(() => {
    console.log(incomingPosts);
    // // setPosts(incomingPosts);
    // Object.values(posts).map((post, idx) => {
    //   console.log(post, idx);
    // });
    // console.log(Object.keys(posts).length);
  });
  return (
    <div>
      <Header />
      <div className="verify-cards-wrapper">
        <div className="verify-cards-container">
          {Object.values(posts).map((post, idx) => {
            return (
              <div key={idx} className="verify-card-container">
                <EventCard data={post} />
                <div className="verify-card-bottom">
                  <textarea
                    name=""
                    id=""
                    defaultValue={
                      "This post is Verified By NDRF.\n\n AapdaMitra | NDRF Team"
                    }
                    onChange={(e) => handleTextAreaChange(e, idx)}
                  ></textarea>
                  <div className="verify-card-buttons">
                    <Button
                      className="verify-card-button remove"
                      onClick={() => handlePostRemove(post, idx)}
                    >
                      Remove{" "}
                      <MdDelete
                        size={"25px"}
                        style={{
                          color: "var(--warning-red)",
                          marginInline: "5px",
                          marginBottom: "2px",
                        }}
                      />
                    </Button>
                    {post.id && post.username && (
                      <Link
                        className="verify-card-button open"
                        style={{ textDecoration: "None" }}
                        to={
                          "https://twitter.com/" +
                          post.username +
                          "/status/" +
                          post.id
                        }
                      >
                        Open Tweet
                        <CiLink
                          size={"25px"}
                          style={{
                            color: "var(--primary-color)",
                            marginInline: "5px",
                          }}
                        />
                      </Link>
                    )}
                    <Button
                      className="verify-card-button verify"
                      onClick={() => {
                        handlePostVerify(post, idx);
                      }}
                    >
                      VERIFY
                    </Button>
                  </div>
                </div>
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
