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
import { IoDownload } from "react-icons/io5";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";

Chart.register(CategoryScale);

const Analytics = () => {
  const [SOSTimelineData, setSOSTimelineData] = useState([]);
  const [sosResolvedToday, setSOSResolvedToday] = useState("");
  const [sosTurnaround, setSOSTurnaround] = useState("");

  const getPastSixHoursData = (data) => {
    var tempObj = [];
    const d = new Date();
    var currHour = d.getHours();
    if (currHour < 10) {
      currHour = "0" + currHour + ":00-0" + (currHour + 1) + ":00";
    } else {
      currHour = currHour + ":00-" + (currHour + 1) + ":00";
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i]["hour"] === currHour) {
        if (i - 5 <= 0) {
          tempObj = data.splice(24 + i - 5, 25);
        }
        tempObj = tempObj.concat(data.splice(Math.max(0, i - 5), i + 1));
      }
    }
    for (var i = 0; i < tempObj.length; i++) {
      tempObj[i]["id"] = i;
    }
    return tempObj;
  };

  const fetchSOSTimelineData = async () => {
    try {
      const response = await axios.get("/api/v1/mobile/per-hr-sos");
      if (response.status === 200) {
        setSOSTimelineData(response.data);
      }
    } catch (error) {
      toast.error("Error fetching SOS Timeline Data. Try again later.");
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
    labels: disasterDistributionData.map((data) => data.disaster),
    datasets: [
      {
        label: "Posts",
        data: disasterDistributionData.map((data) => data.posts),
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
      statistic: 58,
      color: "#C6E7FF",
      icon: <MdOutlinePendingActions className="analytics-card-icon" />,
    },
    {
      title: t("analytics_verified_post"),
      statistic: 80,
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

  const floodIcon = new Icon({
    iconUrl:
      "https://assets.publishing.service.gov.uk/media/653915a7e6c9680014aa9ab1/flood-alert-icon-960.png",
    iconSize: [100, 66],
  });

  const earquakeIcon = new Icon({
    iconUrl:
      "https://png.pngtree.com/png-clipart/20230825/original/pngtree-traffic-sign-with-earthquake-picture-image_8517813.png",
    iconSize: [72, 60],
  });

  const cycloneIcon = new Icon({
    iconUrl:
      "https://png.pngtree.com/png-vector/20240611/ourmid/pngtree-unveiling-nature-s-fury-satellite-views-of-hurricane-png-image_12634675.png",
    iconSize: [80, 80],
  });

  useEffect(() => {
    fetchSOSTimelineData();
    fetchSOSTurnaroundData();
    fetchSOSResolvedData();
    console.log(SOSTimelineData);
  }, []);

  useEffect(() => {
    setLineChartSchema({
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
  }, [SOSTimelineData]);

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
          <LineChart chartData={lineChartSchema} />
        </div>
        <div className="charts-disaster-distribution">
          <DoughnutChart chartData={pieChartSchema} />
        </div>
      </div>
      <div className="map-wrapper">
        <MapContainer center={[23, 80]} zoom={5} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors&ensp;'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[29, 77]} icon={earquakeIcon}>
            <Popup>Earthquake</Popup>
          </Marker>
          <Marker position={[19, 74]} icon={floodIcon}>
            <Popup>Flood</Popup>
          </Marker>
          <Marker position={[21, 87]} icon={cycloneIcon}>
            <Popup>Cyclone</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Analytics;
