import React, { useState } from "react";
import "./Analytics.css";
import Chart from "chart.js/auto";
import LineChart from "../lineChart/LineChart";
import DoughnutChart from "../doughnutChart/DoughnutChart";
import { CategoryScale } from "chart.js";

import { Card } from "react-bootstrap";
import { FaClipboardCheck } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { MdCrisisAlert } from "react-icons/md";
import { IoDownload } from "react-icons/io5";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

Chart.register(CategoryScale);

const Analytics = () => {
  const mapMarkers = [
    {
      geocode: [21.86, 69.48],
    },
  ];

  const SOSTimelineData = [
    {
      id: 1,
      time: "8:00",
      requests: 5,
    },
    {
      id: 2,
      time: "9:00",
      requests: 0,
    },
    {
      id: 3,
      time: "10:00",
      requests: 0,
    },
    {
      id: 4,
      time: "11:00",
      requests: 20,
    },
    {
      id: 5,
      time: "12:00",
      requests: 10,
    },
  ];

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
    labels: SOSTimelineData.map((data) => data.time),
    datasets: [
      {
        label: "SOS Requests",
        data: SOSTimelineData.map((data) => data.requests),
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
      title: "Total Unverified Posts",
      statistic: 58,
      color: "#C6E7FF",
      icon: <MdOutlinePendingActions className="analytics-card-icon" />,
    },
    {
      title: "Total Verified Posts",
      statistic: 80,
      color: "#D4F6FF",
      icon: <FaClipboardCheck className="analytics-card-icon" />,
    },
    {
      title: "SOS raised today",
      statistic: 20,
      color: "#FBFBDF",
      icon: <MdCrisisAlert className="analytics-card-icon" />,
    },
    {
      title: "Posts Scraped Today",
      statistic: 150,
      color: "#FFDDAA",
      icon: <IoDownload className="analytics-card-icon" />,
    },
  ];
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
          <Marker position={[51.505, -0.09]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Analytics;
