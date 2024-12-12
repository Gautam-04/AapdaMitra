import React, { useEffect, useState } from "react";
import "./Realtime.css";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  GeoJSON,
} from "react-leaflet";
import { Icon } from "leaflet";
import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
const provider = new OpenStreetMapProvider();
import indiaGeo from "./india_geo.json";
import Header from "../../components/header/header";
import EventCard from "../../components/eventCard/EventCard";
import { io } from "socket.io-client";
import axios from "axios";
import { PiSealWarningBold } from "react-icons/pi";
import { Button } from "react-bootstrap";
import { FaGlobe } from "react-icons/fa";
import { BiWorld } from "react-icons/bi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NDRFLocations from "./ndrf_centres.json";

const Realtime = () => {
  const socket = io("http://localhost:8000");
  const [posts, setPosts] = useState([]);
  const [topPost, setTopPost] = useState(null);
  const [topLocation, setTopLocation] = useState([23, 80]);
  const [mainMapMarkers, setMainMapMarkers] = useState([]);
  const [countsMap, setCountsMap] = useState(new Map());

  const setColor = ({ properties }) => {
    return { weight: 1 };
  };

  const postIcon = new Icon({
    iconUrl: "https://www.svgrepo.com/show/272074/siren-siren.svg",
    iconSize: [40, 40],
  });

  const ndrfIcon = new Icon({
    iconUrl:
      "https://www.ndrf.gov.in/sites/all/themes/ndrf/images/ndrf_logo_png.png",
    iconSize: [30, 30],
  });

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

    // Append the current topPost to posts and update topPost
    setPosts((prevPosts) => {
      return topPost ? [topPost, ...prevPosts] : prevPosts; // Only append if topPost exists
    });
    setTopPost(newPost);

    // get location
    fetchGeoFromLocation(newPost.location);
    // plot on map
  };

  const fetchNewPost = async () => {
    try {
      const response = await axios.post("/api/v1/jaldibanao/updatedata", {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        console.log("Initial Request Successful");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const testData = [
    {
      date: "2024-12-12T12:00:00Z",
      disaster_type: "Flood",
      hastags: ["#floods", "#disaster"],
      likes: 150,
      location: "Assam, India",
      post_body: "Heavy rains have caused flooding in several areas of Assam.",
      post_body_full:
        "Heavy rains have caused severe flooding in Assam, affecting thousands of residents. Relief operations are underway.",
      post_id: "post12345",
      post_image_b64: "U29tZSBiYXNlNjQgc3RyaW5n",
      post_image_url: "https://example.com/image1.jpg",
      post_title: "Flooding in Assam",
      priority: "High",
      retweets: 75,
      source: "Twitter",
      url: "https://twitter.com/post12345",
      username: "user_assam",
      createdAt: "2024-12-12T12:30:00Z",
    },
    {
      date: "2024-12-11T10:00:00Z",
      disaster_type: "Cyclone",
      hastags: ["#cyclone", "#emergency"],
      likes: 300,
      location: "Odisha, India",
      post_body: "Cyclone 'Vayu' has made landfall near Odisha's coastline.",
      post_body_full:
        "Cyclone 'Vayu' has made landfall near Odisha, bringing strong winds and heavy rainfall. Authorities have initiated evacuations.",
      post_id: "post67890",
      post_image_b64: "VGhpcyBpcyBhbm90aGVyIGJhc2U2NCBzdHJpbmc=",
      post_image_url: "https://example.com/image2.jpg",
      post_title: "Cyclone Vayu Hits Odisha",
      priority: "Critical",
      retweets: 400,
      source: "Facebook",
      url: "https://facebook.com/post67890",
      username: "user_odisha",
      createdAt: "2024-12-11T10:15:00Z",
    },
    {
      date: "2024-12-10T09:00:00Z",
      disaster_type: "Earthquake",
      hastags: ["#earthquake", "#emergency"],
      likes: 180,
      location: "Himachal Pradesh, India",
      post_body:
        "An earthquake of magnitude 5.8 struck Himachal Pradesh this morning.",
      post_body_full:
        "An earthquake of magnitude 5.8 struck Himachal Pradesh, causing tremors across the region. Rescue teams have been deployed.",
      post_id: "post54321",
      post_image_b64: "QW5vdGhlciBiYXNlNjQgaW1hZ2U=",
      post_image_url: "https://example.com/image3.jpg",
      post_title: "Earthquake in Himachal Pradesh",
      priority: "High",
      retweets: 220,
      source: "Instagram",
      url: "https://instagram.com/post54321",
      username: "user_himachal",
      createdAt: "2024-12-10T09:15:00Z",
    },
  ];

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

  function SetViewOnClick(location) {
    const map = useMap();
    if (location) {
      map.flyTo([location["location"][0], location["location"][1]], 12, {
        duration: 1,
      });
    }

    return null;
  }

  useEffect(() => {
    socket.on("updateRealTimeData", (data) => {
      toast.warn("New Post Detected!");
      handleNewPostFromSocket(data);
    });

    return () => {
      socket.off("updateRealTimeData", () => {});
    };
  }, [topPost]);

  useEffect(() => {
    fetchNewPost();
  }, []);

  return (
    <>
      <Header />
      <div className="realtime-page-wrapper">
        <div className="realtime-posts-popup">
          {topPost && (
            <div className="card">
              <div className="card-content">
                <div className="card-left">
                  <h2 className="headline">{topPost.headline}</h2>
                  {topPost.post_title && (
                    <h2 className="headline">{topPost.post_title}</h2>
                  )}
                  <p className="text">{topPost.post_body}</p>
                </div>
                <div className="card-center">
                  <div className="info-grid">
                    {topPost.location && (
                      <div className="info-item">
                        <span className="info-label">Location</span>
                        <span className="info-value">{topPost.location}</span>
                      </div>
                    )}
                    {topPost.date && (
                      <div className="info-item">
                        <span className="info-label">Date</span>
                        <span className="info-value">{topPost.date}</span>
                      </div>
                    )}
                    {topPost.disaster_type && (
                      <div className="info-item">
                        <span className="info-label">Disaster Type</span>
                        <span className="info-value">
                          {topPost.disaster_type}
                        </span>
                      </div>
                    )}
                    {topPost.priority && (
                      <div className="info-item">
                        <span className="info-label">Priority</span>
                        <span className="info-value">{topPost.priority}</span>
                      </div>
                    )}
                  </div>
                  <div className="source">{topPost.source}</div>
                </div>
                {topPost.post_image_url && (
                  <div className="card-right">
                    <img
                      src={
                        topPost.source == "AapdaMitra App"
                          ? `data:image/png;base64,${topPost.post_image_b64}`
                          : topPost.post_image_url
                      }
                      alt={topPost.post_title}
                      className="card-image"
                    />
                  </div>
                )}
              </div>
              <div className="top-post-bottom">
                <div className="top-post-map">
                  <MapContainer
                    center={[23, 83]}
                    zoom={4}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors&ensp;'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* <GeoJSON data={indiaGeo} style={setColor} /> */}
                    {topLocation && (
                      <Marker position={topLocation} icon={postIcon}></Marker>
                    )}
                    <SetViewOnClick location={topLocation} />
                  </MapContainer>
                </div>
                {countsMap.get(
                  `${topPost.disaster_type}-${topPost.location}-${
                    topPost.date.split("T")[0]
                  }`
                ) > 1 && (
                  <div className="top-post-insights">
                    <PiSealWarningBold /> This post matched with other recent
                    posts.
                    {/* <Button>View related posts</Button> */}
                  </div>
                )}
              </div>
            </div>
          )}
          {!topPost && <h4>Checking for posts...</h4>}
          {posts.map((obj, idx) => {
            // console.log(obj);
            return <EventCard key={idx} data={obj} />;
          })}
        </div>
      </div>
    </>
  );
};

export default Realtime;
