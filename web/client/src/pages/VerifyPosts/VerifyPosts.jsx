import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/Footer";
import "./VerifyPosts.css";
import EventCard from "../../components/eventCard/EventCard";
import { Button, Carousel, Dropdown, Form } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { CiLink } from "react-icons/ci";
import axios from "axios";
import { toast } from "react-toastify";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";

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
        if (response.status === 200) {
          toast.success("Comment added on post successfully!");
          handlePostRemoveDatabase(post);
        }
      } else if (post.source === "AapdaMitra App") {
        const toSend = {
          title: post.post_title,
          body: post.post_body,
          location: post.location,
          date: post.date,
          type: post.disaster_type,
          imageUrl: post.post_image_b64 || post.post_image_url,
          source: post.source,
          postId: post.post_id,
          priority: "",
        };

        const response = await axios.post(
          "http://localhost:8000/v1/mobile/add-post",
          toSend,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status === 201) {
          toast.success("Post Verified successfully!");
          handlePostRemoveDatabase(post);
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
    // console.log(postComments);
  };
  const handleTemplateChange = (e, idx) => {
    var temp = postComments;
    temp[idx] = e.target.value;
    setPostComments(temp);
    // console.log(postComments);
  };

  const handlePostRemoveSelection = (post, idx) => {
    console.log(idx);
    setPosts((prevPosts) => prevPosts.filter((e) => e !== post));
  };

  const handlePostRemoveDatabase = async (post, idx) => {
    try {
      const formData = new FormData();
      formData.append("objId", post.objId);

      const response = await fetch("http://localhost:5000/search/remove-post", {
        method: "POST",
        body: formData,
      });
      if (response.status === 200) {
        toast.success("Post removed from database!");
        setPosts((prevPosts) => prevPosts.filter((e) => e !== post));
      }
    } catch (error) {
      toast.error("Something went wrong. Try again later.");
      console.error(error);
    }
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
        <Carousel
          interval={null}
          prevIcon={
            <GrFormPreviousLink size={"50px"} color="var(--primary-color)" />
          }
          nextIcon={
            <GrFormNextLink size={"50px"} color="var(--primary-color)" />
          }
          wrap={false}
          className="verify-cards-container"
        >
          {Object.values(posts).map((post, idx) => {
            return (
              <Carousel.Item key={idx} className="verify-card-container">
                <EventCard data={post} />
                <div className="verify-card-bottom">
                  {/* <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Message Description</Form.Label>
                      <Form.Select
                        // value={postComments[idx].template}
                        onChange={(e) => handleTemplateChange(e, idx)}
                      >
                        <option defaultValue disabled>
                          Select Template
                        </option>
                        <option value="sms">SMS</option>
                        <option value="push">
                          Push Notification (through App)
                        </option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Broadcast Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter Comment."
                        value={postComments[idx]}
                        defaultValue={
                          "This post is Verified By NDRF.\n\n AapdaMitra | NDRF Team"
                        }
                        onChange={(e) => handleTextAreaChange(e, idx)}
                      />
                    </Form.Group>
                  </Form> */}
                  <textarea
                    name=""
                    id=""
                    defaultValue={
                      "This post is Verified By NDRF.\n\n AapdaMitra | NDRF Team"
                    }
                    value={postComments[idx]}
                    onChange={(e) => handleTextAreaChange(e, idx)}
                  ></textarea>
                  <div className="verify-card-buttons">
                    {/* <Button
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
                    </Button> */}
                    <Dropdown className="verify-card-remove-dropdown">
                      <Dropdown.Toggle id="verify-card-dropdown">
                        Remove Post{" "}
                        <MdDelete
                          size={"25px"}
                          style={{
                            color: "var(--warning-red)",
                            marginInline: "5px",
                            marginBottom: "2px",
                          }}
                        />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handlePostRemoveSelection(post, idx)}
                        >
                          Remove from Selection{" "}
                          <MdDelete
                            size={"25px"}
                            style={{
                              color: "var(--warning-red)",
                              marginInline: "5px",
                              marginBottom: "2px",
                            }}
                          />
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handlePostRemoveDatabase(post, idx)}
                        >
                          Remove from Database{" "}
                          <MdDelete
                            size={"25px"}
                            style={{
                              color: "var(--warning-red)",
                              marginInline: "5px",
                              marginBottom: "2px",
                            }}
                          />
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    {post.source === "Twitter" && (
                      <Link
                        className="verify-card-button open"
                        style={{ textDecoration: "None" }}
                        to={
                          "https://twitter.com/" +
                          post.username +
                          "/status/" +
                          post.post_id
                        }
                        target="_blank"
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
              </Carousel.Item>
            );
          })}
        </Carousel>
      </div>

      <Footer />
    </div>
  );
};

export default VerifyPosts;
