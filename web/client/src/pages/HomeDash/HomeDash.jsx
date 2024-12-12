import React, { useEffect, useState } from "react";
import "./HomeDash.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/Footer";
import { Carousel } from "react-bootstrap";
import EventCard from "../../components/eventCard/EventCard";
import { io } from "socket.io-client";
import floods from "./floods.json";
import cyclones from "./cyclones.json";
import earthquakes from "./earthquake.json";
import india from "./india.json";
import landslides from "./landslides.json";
import world from "./world.json";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";

import axios from "axios";

const HomeDash = () => {
  const [newsList, setNewsList] = useState([]);
  const [currentNews, setCurrentNews] = useState("Floods");
  const carouselImages = [
    "https://img.etimg.com/thumb/msid-95237103,width-300,height-225,imgsize-172928,resizemode-75/india-floods.jpg",
    "https://images.news18.com/ibnlive/uploads/2024/07/kerala-wayanad-2024-07-69dc65212046479bd237e5e7b4914e7d.jpg?impolicy=website&width=360&height=270",
    "https://im.rediff.com/money/2015/may/04nepal-2.jpg?w=670&h=900",
    "https://images.indianexpress.com/2024/12/PTI12_10_2024_000011B.jpg?w=640",
    "https://images.indianexpress.com/2024/09/rain-PTI-5col.jpg?w=640",
  ];

  const fetchNewPost = async () => {
    try {
      const response = await axios.post("/api/v1/jaldibanao/updatedata", {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        console.log("Initial Request Successful");
      }
    } catch (error) {
      toast.error("Error getting post. Try again later.");
      console.error(error);
    }
  };

  function SetViewOnClick(location) {
    const map = useMap();
    if (location) {
      map.flyTo([location["location"][0], location["location"][1]], 12, {
        duration: 1,
      });
    }

    return null;
  }

  const handleNewPostFromSocket = (newPost) => {
    console.log("New post received:", newPost);
    const key = `${newPost.disaster_type}-${newPost.location}-${
      newPost.date.split("T")[0]
    }`;
    setCountsMap((prevCountsMap) => {
      const newCountsMap = new Map(prevCountsMap); // Create a copy
      if (newCountsMap.has(key)) {
        newCountsMap.set(key, newCountsMap.get(key) + 1);
      } else {
        newCountsMap.set(key, 1);
      }
      return newCountsMap; // Return the updated Map
    });

    console.log(countsMap);

    // Append the current `topPost` to `posts` and update `topPost`
    setPosts((prevPosts) => {
      return topPost ? [topPost, ...prevPosts] : prevPosts; // Only append if topPost exists
    });
    setTopPost(newPost);

    // get location
    fetchGeoFromLocation(newPost.location);
    // plot on map
  };

  const fetchGeoFromLocation = async (location) => {
    // console.log(location);
    const results = await provider.search({ query: location });
    // console.log(results);
    // // setTopPost((prev) => ({
    // //   ...prev,
    // //   marker: [results[0]["y"], results[0]["x"]],
    // // }));
    setTopLocation([results[0]["y"], results[0]["x"]]);
    setMainMapMarkers((prev) => [...prev, [results[0]["y"], results[0]["x"]]]);
    console.log(mainMapMarkers);
  };

  // useEffect(() => {
  //   socket.on("updateRealTimeData", (data) => {
  //     toast.warn("New Post Detected!");
  //     handleNewPostFromSocket(data);
  //   });

  //   return () => {
  //     socket.off("updateRealTimeData", () => {});
  //   };
  // }, [topPost]);

  useEffect(() => {
    const socket = io("http://localhost:8000/");

    // Listen for new data from the server
    socket.on("updateRealTimeData", (data) => {
      // Add new item to the list dynamically
      setNewsList((prevList) => [data, ...prevList]);

      // Show toast notification
      toast.info(`New data received`, {
        position: "top-right",
      });
    });

    // Cleanup the socket connection on unmount
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    fetchNewPost();
  }, []);

  return (
    <div className="home-dash-wrapper">
      <Header />
      <div className="news-nav">
        <div className="news-nav-wrapper">
          <div
            className="news-nav-item"
            onClick={() => setCurrentNews("India")}
          >
            India
          </div>
          <div
            className="news-nav-item"
            onClick={() => setCurrentNews("World")}
          >
            World
          </div>
          <div
            className="news-nav-item"
            onClick={() => setCurrentNews("Floods")}
          >
            Floods
          </div>
          <div
            className="news-nav-item"
            onClick={() => setCurrentNews("Cyclones")}
          >
            Cyclones
          </div>
          <div
            className="news-nav-item"
            onClick={() => setCurrentNews("Earthquake")}
          >
            Earthquake
          </div>
          <div
            className="news-nav-item"
            onClick={() => setCurrentNews("Landslides")}
          >
            Landslides
          </div>
        </div>
      </div>
      <div className="hero-section">
        <div className="hero-left">
          <div className="hero-carousel-wrapper">
            <span>Latest Photos from News</span>
            <Carousel className="hero-carousel" wrap>
              {carouselImages.map((imageLink, idx) => {
                return (
                  <Carousel.Item key={idx}>
                    <img className="hero-carousel-image" src={imageLink} />
                  </Carousel.Item>
                );
              })}
            </Carousel>
          </div>
          <span>Latest News on Video</span>
          <iframe
            width="100%"
            height="30%"
            src="https://www.youtube.com/embed/SkAGCBTsp8A?si=P1IrOZVB2ClXHOD4"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
        <div className="hero-center">
          {currentNews === "India" &&
            india.map((data, idx) => {
              return <EventCard key={idx} data={data} />;
            })}
          {/* {currentNews === "India" && (
            <div style={{ padding: "20px" }}>
              <h2>Dynamic List</h2>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {newsList.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      background: "#f1f1f1",
                      marginBottom: "10px",
                      padding: "10px",
                      borderRadius: "5px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                  </motion.li>
                ))}
              </ul>
              <ToastContainer />
            </div>
          )} */}
          {currentNews === "Floods" &&
            floods.map((data, idx) => {
              return <EventCard key={idx} data={data} />;
            })}
          {currentNews === "World" &&
            world.map((data, idx) => {
              return <EventCard key={idx} data={data} />;
            })}
          {currentNews === "Cyclones" &&
            cyclones.map((data, idx) => {
              return <EventCard key={idx} data={data} />;
            })}
          {currentNews === "Earthquake" &&
            earthquakes.map((data, idx) => {
              return <EventCard key={idx} data={data} />;
            })}
          {currentNews === "Landslides" &&
            landslides.map((data, idx) => {
              return <EventCard key={idx} data={data} />;
            })}
        </div>
        {/* <div className="hero-right">
          <div className="news-panel">
            <span className="realtime-news">Realtime News</span>
            {newsList.map((news, index) => {
              return (
                <EventCard key={index} data={news} className="news-item" />
              );
            })}
          </div>
        </div> */}
      </div>
      <Footer />
    </div>
  );
};

export default HomeDash;
