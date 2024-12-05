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
import { MdOutlineSos } from "react-icons/md";
import { GiSiren } from "react-icons/gi";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import L from "leaflet";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";

Chart.register(CategoryScale);

const Analytics = () => {
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
    fetchUnverifiedPostCount();
    fetchSOSTimelineData();
    fetchSOSTurnaroundData();
    fetchSOSResolvedData();
    fetchVerifiedPostData();
    fetchAnalyticsData();
    // console.log(SOSTimelineData);
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
          {allAnalyticsData.regional.map((region, idx) => {
            return (
              <Marker
                key={idx}
                position={[
                  region.location.split(", ")[0],
                  region.location.split(", ")[1],
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
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default Analytics;
