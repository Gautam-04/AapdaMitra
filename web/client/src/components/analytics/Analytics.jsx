import React, { useEffect, useState } from "react";
import "./Analytics.css";
import Chart from "chart.js/auto";
import LineChart from "../lineChart/LineChart";
import DoughnutChart from "../doughnutChart/DoughnutChart";
import { CategoryScale } from "chart.js";
import { Card } from "react-bootstrap";
import { FaClipboardCheck } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { MdCrisisAlert } from "react-icons/md";
import { FaHourglassHalf } from "react-icons/fa";
import { AiOutlineIssuesClose } from "react-icons/ai";
import { HiBuildingLibrary } from "react-icons/hi2";
import { MdOutlineSos } from "react-icons/md";
import { GiSiren } from "react-icons/gi";
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
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import indiaGeo from "./india_geo.json";
import indiaGeoNew from "./india_geo_new.json";
// import { io } from "socket.io-client";

Chart.register(CategoryScale);

const Analytics = () => {
  // const socket = io("http://localhost:8000");
  const [SOSTimelineData, setSOSTimelineData] = useState([]);
  const [verifiedPostData, setVerifiedPostData] = useState({
    sourceCount: [],
    verifiedPostCount: 0,
  });
  const [allAnalyticsData, setAllAnalyticsData] = useState({
    regional: [],
  });
  const [unverifiedPostCount, setUnverifiedPostCount] = useState("0");
  const [sosResolvedToday, setSOSResolvedToday] = useState("0");
  const [sosTurnaround, setSOSTurnaround] = useState("0s");
  const [regionalData, setRegionalData] = useState({ stateAnalytics: [] });

  const getPastSixHoursData = (inputData) => {
    const currentHour = new Date().getHours();

    const filteredData = inputData.filter((data, index) => {
      return index >= currentHour - 5 && index <= currentHour;
    });
    return filteredData;
  };

  const fetchSOSTimelineData = async () => {
    try {
      const response = await axios.get("/api/v1/mobile/per-hr-sos");
      if (response.status === 200) {
        setSOSTimelineData(getPastSixHoursData(response.data));
        console.log(response.data);
      }
    } catch (error) {
      toast.error("Error fetching SOS Timeline Data. Try again later.");
      console.error(error);
    }
  };

  const fetchVerifiedPostData = async () => {
    try {
      const response = await axios.get("/api/v1/mobile/get-verified-data");
      if (response.status === 200) {
        setVerifiedPostData(response.data);
        // console.log(response.data);
      }
    } catch (error) {
      toast.error("Error fetching Verified Posts Data. Try again later.");
      console.error(error);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get("/api/v1/mobile/get-analytics");
      if (response.status === 200) {
        setAllAnalyticsData(response.data);
        console.log(response.data);
      }
    } catch (error) {
      toast.error("Error fetching All Analytics Data. Try again later.");
      console.error(error);
    }
  };

  const fetchUnverifiedPostCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/search/get-unverified-count"
      );
      if (response.status === 200) {
        console.log(response.data.count);
        setUnverifiedPostCount(response.data.count);
      }
    } catch (error) {
      toast.error("Error fetching Unverified Posts Data. Try again later.");
      console.error(error);
    }
  };

  const mapMarkers = [
    {
      geocode: [21.86, 69.48],
    },
  ];

  const fetchSOSResolvedData = async () => {
    try {
      const response = await axios.get("/api/v1/mobile/sos-count");
      if (response.status === 200) {
        setSOSResolvedToday(response.data.resolvedCount);
      }
    } catch (error) {
      toast.error("Error fetching SOS Count Data. Try again later.");
      console.error(error);
    }
  };

  const fetchSOSTurnaroundData = async () => {
    try {
      const response = await axios.get("/api/v1/mobile/sos-average-time");
      if (response.status === 200) {
        setSOSTurnaround(response.data.averageTimeFormatted);
      }
    } catch (error) {
      toast.error("Error fetching SOS Turnaround Data. Try again later.");
      console.error(error);
    }
  };

  const fetchDetailedSOSData = async () => {
    try {
      const response = await axios.get("/api/v1/mobile/get-sos-detailed-sos");
      if (response.status === 200) {
        setRegionalData(response.data);
        console.log(response.data);
      }
    } catch (error) {
      toast.error("Error fetching SOS Turnaround Data. Try again later.");
      console.error(error);
    }
  };

  const { t } = useTranslation();

  const disasterDistributionData = [
    {
      id: 1,
      disaster: "Earthquake",
      posts: 200,
    },
    {
      id: 2,
      disaster: "Floods",
      posts: 400,
    },
    {
      id: 3,
      disaster: "Fire",
      posts: 250,
    },
    {
      id: 4,
      disaster: "Explosions",
      posts: 900,
    },
    {
      id: 5,
      disaster: "Cloud Bursts",
      posts: 600,
    },
  ];

  //   const chartData = [
  //     {
  //       id: 1,
  //       year: 2016,
  //       userGain: 80000,
  //       userLost: 823,
  //     },
  //     {
  //       id: 2,
  //       year: 2017,
  //       userGain: 45677,
  //       userLost: 345,
  //     },
  //     {
  //       id: 3,
  //       year: 2018,
  //       userGain: 78888,
  //       userLost: 555,
  //     },
  //     {
  //       id: 4,
  //       year: 2019,
  //       userGain: 90000,
  //       userLost: 4555,
  //     },
  //     {
  //       id: 5,
  //       year: 2020,
  //       userGain: 4300,
  //       userLost: 234,
  //     },
  //   ];

  const [pieChartSchema, setPieChartSchema] = useState({
    labels: verifiedPostData.sourceCount.map((data) => data["source"]),
    datasets: [
      {
        label: "Posts",
        data: verifiedPostData.sourceCount.map((data) => data["count"]),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "lightslategray",
        borderWidth: 1,
      },
    ],
  });

  const [lineChartSchema, setLineChartSchema] = useState({
    labels: SOSTimelineData.map((data) => data["hour"]),
    datasets: [
      {
        label: t("analytics_sos_request"),
        data: SOSTimelineData.map((data) => data["count"]),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  });

  const analyticsData = [
    {
      title: t("analytics_unverified_posts"),
      statistic: unverifiedPostCount,
      color: "#C6E7FF",
      icon: <MdOutlinePendingActions className="analytics-card-icon" />,
    },
    {
      title: t("analytics_verified_post"),
      statistic: verifiedPostData.verifiedPostCount,
      color: "#D4F6FF",
      icon: <FaClipboardCheck className="analytics-card-icon" />,
    },
    {
      title: t("analytics_sos_raised"),
      statistic: sosResolvedToday,
      color: "#FBFBDF",
      icon: <MdCrisisAlert className="analytics-card-icon" />,
    },
    {
      title: t("analytics_posts_scraped"),
      statistic: sosTurnaround,
      color: "#FFDDAA",
      icon: <FaHourglassHalf className="analytics-card-icon" />,
    },
  ];

  const regionIcon = new Icon({
    iconUrl: "https://www.svgrepo.com/show/505452/pin-1.svg",
    iconSize: [50, 50],
  });

  // const earquakeIcon = new Icon({
  //   iconUrl:
  //     "https://png.pngtree.com/png-clipart/20230825/original/pngtree-traffic-sign-with-earthquake-picture-image_8517813.png",
  //   iconSize: [72, 60],
  // });
  //
  // const cycloneIcon = new Icon({
  //   iconUrl:
  //     "https://png.pngtree.com/png-vector/20240611/ourmid/pngtree-unveiling-nature-s-fury-satellite-views-of-hurricane-png-image_12634675.png",
  //   iconSize: [80, 80],
  // });

  const icons = {
    earthquake: L.icon({
      iconUrl: "https://www.svgrepo.com/show/346804/earthquake.svg",
      iconSize: [45, 45],
    }),
    flood: L.icon({
      iconUrl: "https://www.svgrepo.com/show/467723/flood.svg",
      iconSize: [45, 45],
    }),
    cyclone: L.icon({
      iconUrl: "https://www.svgrepo.com/show/335815/whirlwind.svg",
      iconSize: [45, 45],
    }),
    wildfire: L.icon({
      iconUrl: "https://www.svgrepo.com/show/289319/forest-fire.svg",
      iconSize: [32, 32],
    }),
    drought: L.icon({
      iconUrl: "https://www.svgrepo.com/show/90502/plant-on-drought.svg",
      iconSize: [32, 32],
    }),
  };

  const disasters = [
    { id: 1, position: [29, 77], type: "Earthquake", icon: icons.earthquake },
    { id: 2, position: [19, 74], type: "Flood", icon: icons.flood },
    { id: 3, position: [21, 87], type: "Cyclone", icon: icons.cyclone },
    { id: 4, position: [31, 76], type: "Wildfire", icon: icons.wildfire },
    { id: 5, position: [24, 72], type: "Drought", icon: icons.drought },
    { id: 6, position: [25, 85], type: "Flood", icon: icons.flood },
    { id: 7, position: [16, 73], type: "Cyclone", icon: icons.cyclone },
    { id: 8, position: [10, 76], type: "Wildfire", icon: icons.wildfire },
  ];

  useEffect(() => {
    // socket.on("newSos", () => {
    //   console.log("New SOS received!");
    // });

    fetchUnverifiedPostCount();
    fetchSOSTimelineData();
    fetchSOSTurnaroundData();
    fetchSOSResolvedData();
    fetchVerifiedPostData();
    fetchAnalyticsData();
    fetchDetailedSOSData();
    // console.log(SOSTimelineData);

    // return () => {
    //   socket.off("newSos", handleNewSos);
    // };
  }, []);

  useEffect(() => {
    setLineChartSchema({
      labels: SOSTimelineData.map((data) => data["hour"]),
      datasets: [
        {
          label: t("analytics_sos_request"),
          data: SOSTimelineData.map((data) => data["count"]),
          backgroundColor: [
            "#2b3674",
            // "#2a71d0",
          ],
          // fill: false,
          borderColor: "#2b3674",
          borderWidth: 1,
          tension: 0.3,
        },
      ],
    });
  }, [SOSTimelineData]);

  useEffect(() => {
    setPieChartSchema({
      labels: verifiedPostData.sourceCount.map((data) => data["source"]),
      datasets: [
        {
          label: t("analytics_sos_request"),
          data: verifiedPostData.sourceCount.map((data) => data["count"]),
          backgroundColor: [
            // "rgba(75,192,192,1)",
            "#1DA1F2",
            "#2b3674",
            "#fc7753",
            "#FFFFFF",
          ],
          fill: false,
          borderColor: "#2b3674",
          borderWidth: 1,
          // tension: 0.3,
        },
      ],
    });
    console.log(verifiedPostData.sourceCount);
  }, [verifiedPostData]);

  const setColor = ({ properties }) => {
    return { weight: 1 };
  };

  return (
    <div className="analytics-wrapper">
      <div className="analytics-cards">
        {analyticsData.map((data, idx) => {
          return (
            <Card
              key={idx}
              style={{ padding: "2rem", backgroundColor: `${data.color}` }}
              className="analytics-card"
            >
              {data.icon}
              <div className="card-content-section">
                <Card.Text>{data.statistic}</Card.Text>
                <Card.Title>{data.title}</Card.Title>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="analysis-charts">
        <div className="charts-sos-history">
          <LineChart
            chartData={lineChartSchema}
            title={"SOS Timeline (Past 6 Hours)"}
          />
        </div>
        <div className="charts-disaster-distribution">
          <DoughnutChart
            chartData={pieChartSchema}
            title={"Disaster Distribution"}
          />
        </div>
      </div>
      <div className="map-wrapper">
        <MapContainer center={[23, 80]} zoom={5} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors&ensp;'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* <TileLayer
            url="https://tiles.windy.com/tiles/v9.0/wind/{z}/{x}/{y}.png?key=q6IIrk5CRoCaOspZyLUxmUO3OkDKmliR"
            attribution='&copy; <a href="https://www.windy.com">Windy.com</a>'
          /> */}
          {regionalData.stateAnalytics.length > 0 && (
            <GeoJSON
              data={indiaGeo}
              style={setColor}
              onEachFeature={(feature, layer) => {
                layer.bindPopup(() => {
                  var sosCount = 0;
                  var resolutionTime = "-";
                  console.log(regionalData);
                  for (var i = 0; i < regionalData.stateAnalytics.length; i++) {
                    if (
                      regionalData.stateAnalytics[i]._id ===
                      feature.properties.st_nm
                    ) {
                      sosCount = regionalData.stateAnalytics[i].count;
                      resolutionTime =
                        regionalData.stateAnalytics[i].avgResolutionTime;
                    }
                  }
                  return `<div class='map-popup-cards'>
                    <div
                      class="map-popup-card popup-state"
                      style="background-color:#C6E7FF"
                    >
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z"></path><path fill-rule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z" clip-rule="evenodd"></path><path d="M12 7.875a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"></path></svg>
                      <span>State</span>
                      ${feature.properties.st_nm}
                    </div>
                    <div
                      class="map-popup-card"
                      style="background-color:#FBFBDF"
                    >
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="35px" width="35px" xmlns="http://www.w3.org/2000/svg"><path d="M157.705 400.355h193.09v17.53h-193.09v-17.53zm180.8-17.53h-165v-96.82a53.29 53.29 0 0 1 53.29-53.29h58.43a53.29 53.29 0 0 1 53.28 53.29v96.79zm-106.64-135.77h-10.44a37.83 37.83 0 0 0-37.83 37.83v77.22h48.27v-115zm-197 79.59h103.58v-17.53H34.875v17.53zm137.41-107.9l-73.22-73.23-12.4 12.4 73.23 73.23zm92.5-124.63h-17.54v103.57h17.53V94.115zm149 51.39l-73.23 73.23 12.4 12.4 73.23-73.23zm-40.18 163.6v17.53h103.54v-17.52h-103.57z"></path></svg>
                      <span>SOS Last 7 Days</span>
                      ${sosCount}
                    </div>
                    <div
                      class="map-popup-card"
                      style="background-color:#FFDDAA"
                    >
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="35px" width="35px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M13.5 7h-3c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8h-3V9h3v6zM1 15h4v-2H3c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h4v2H3v2h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2H1v-2zm16 0h4v-2h-2c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h4v2h-4v2h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-4v-2z"></path></svg>
                      <span>SOS Response Time</span>
                      ${resolutionTime}
                    </div>
                </div>`;
                });
              }}
            />
          )}
          {/* <Marker position={[29, 77]} icon={earquakeIcon}>
            <Popup>Earthquake</Popup>
          </Marker>
          <Marker position={[19, 74]} icon={floodIcon}>
            <Popup>Flood</Popup>
          </Marker>
          <Marker position={[21, 87]} icon={cycloneIcon}>
            <Popup>Cyclone</Popup>
          </Marker> */}
          {/* {disasters.map((disaster) => (
            <Marker
              key={disaster.id}
              position={disaster.position}
              icon={disaster.icon}
            >
              <Popup>
                <strong>{disaster.type}</strong>
                <br />
                Location: {disaster.position[0]}, {disaster.position[1]}
              </Popup>
            </Marker>
          ))} */}
          {/* {allAnalyticsData.regional.map((region, idx) => {
            return (
              <Marker
                key={idx}
                position={[
                  region.location.split(",")[0],
                  region.location.split(",")[1],
                ]}
                icon={regionIcon}
              >
                <Popup>
                  <div className="map-popup-cards">
                    <div
                      className="map-popup-card"
                      style={{ backgroundColor: "#C6E7FF" }}
                    >
                      <AiOutlineIssuesClose size={"35px"} />
                      <span>Issues Last 7 Days</span>
                      {region.issues.last7Days}
                    </div>
                    <div
                      className="map-popup-card"
                      style={{ backgroundColor: "#D4F6FF" }}
                    >
                      <MdOutlinePendingActions size={"35px"} />
                      <span>Issues Unresolved</span>
                      {region.sos.unresolved}
                    </div>
                    <div
                      className="map-popup-card"
                      style={{ backgroundColor: "#FBFBDF" }}
                    >
                      <GiSiren size={"35px"} />
                      <span>SOS Last 7 Days</span>
                      {region.sos.last7Days}
                    </div>
                    <div
                      className="map-popup-card"
                      style={{ backgroundColor: "#FFDDAA" }}
                    >
                      <MdOutlineSos size={"35px"} />
                      <span>SOS Unresolved</span>
                      {region.sos.unresolved}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })} */}
        </MapContainer>
      </div>
    </div>
  );
};

export default Analytics;
