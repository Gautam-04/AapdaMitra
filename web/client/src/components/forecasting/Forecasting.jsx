import React, { useState } from "react";
import "./Forecasting.css";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  GeoJSON,
} from "react-leaflet";

import floodGeo from "./floodgeo.json";
import { Form } from "react-bootstrap";

const Forecasting = () => {
  const [disasterType, setDisasterType] = useState("Flood");

  const floodStyle = ({ properties }) => {
    var fillColor = "#242424";
    var fillOpacity = 0.6;
    var value = properties["Number of_Flood Events"];
    if (value > 0.01 && value <= 10.0) {
      fillColor = "#a6cee3";
    } else if (value > 10.0 && value <= 30.0) {
      fillColor = "#1f78b4";
    } else if (value > 30.0 && value <= 50.0) {
      fillColor = "#ff7f0e";
    } else if (value > 50.0 && value <= 70.0) {
      fillColor = "#f27c29";
    } else if (value > 70.0 && value <= 127.0) {
      fillColor = "#d62728";
    }

    return { weight: 0.8, fillColor: fillColor, fillOpacity: fillOpacity };
  };

  return (
    <div className="forecasting-wrapper">
      {/* <Form.Select style={{ maxWidth: "30%" }}>
        <option>Floods districtwise (1969 to 2019)</option>
        <option>Earthquake districtwise (1969 to 2019)</option>
        <option>Snowfall districtwise (1969 to 2019)</option>
        <option>Heatwave districtwise (1969 to 2019)</option>
      </Form.Select> */}
      <div className="map-wrapper forecasting">
        <MapContainer center={[23, 80]} zoom={5} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors&ensp;'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
            data={floodGeo}
            style={floodStyle}
            onEachFeature={(feature, layer) => {
              console.log(feature);
              layer.bindPopup(
                `<div class='forecasting-map-popup'>
                    <div class='forecasting-map-popup-stat' style="background-color:#C6E7FF">
                        <span>State:</span>${feature.properties.STATE}
                    </div>
                    <div class='forecasting-map-popup-stat' style="background-color:#D4F6FF">
                        <span>District:</span>${feature.properties.DISTRICT}
                    </div>
                    <div class='forecasting-map-popup-stat' style="background-color:#FBFBDF">
                        <span>No. of Floods:</span>${feature.properties["Number of_Flood Events"]}
                    </div>
                </div>`
              );
              layer.on("mouseover", function (e) {
                this.openPopup();
              });
              layer.on("mouseout", function (e) {
                this.closePopup();
              });
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default Forecasting;
