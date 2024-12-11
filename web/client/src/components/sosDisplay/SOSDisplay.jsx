import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, Card, Form, Modal } from "react-bootstrap";
import "./SOSDisplay.css";
import { MdMedicalServices } from "react-icons/md";
import { FaFire } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa";
import { PiEmptyBold } from "react-icons/pi";
import { PiPlant } from "react-icons/pi";
import emergencyLocations from "./emergencyLocations.json";

import { OpenStreetMapProvider } from "leaflet-geosearch";
const provider = new OpenStreetMapProvider();
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Icon, LatLng } from "leaflet";
import { GiTemporaryShield } from "react-icons/gi";
import { io } from "socket.io-client";

const SOSDisplay = () => {
  const socket = io("http://localhost:8000");
  const [pendingSOS, setPendingSOS] = useState([]);
  const [currentSOS, setCurrentSOS] = useState(null);
  const [currentSOSLocation, setCurrentSOSLocation] = useState([23, 80]);
  const [show, setShow] = useState(false);

  const sosIcon = new Icon({
    iconUrl: "https://www.svgrepo.com/show/272074/siren-siren.svg",
    iconSize: [40, 40],
  });

  const medicIcon = new Icon({
    iconUrl:
      "https://www.svgrepo.com/show/385155/health-healthcare-hospital-medic-medical-medicine.svg",
    iconSize: [28, 28],
  });

  const fireIcon = new Icon({
    iconUrl: "https://www.svgrepo.com/show/500065/fire-hydrant.svg",
    iconSize: [28, 28],
  });

  const policeIcon = new Icon({
    iconUrl: "https://www.svgrepo.com/show/407224/police-car.svg",
    iconSize: [28, 28],
  });

  const handleOpenResolver = (sos) => {
    setCurrentSOS(sos);
    fetchGeoFromLocation(sos.location);

    setShow(true);
  };

  const handleCloseResolver = () => {
    setShow(false);
  };

  const emergencyIconMap = {
    Medical: (
      <MdMedicalServices className="sos-type-icon" color="var(--warning-red)" />
    ),

    "Natural Disaster": <PiPlant className="sos-type-icon" color="#008000" />,

    Fire: <FaFire className="sos-type-icon" color="#ff6a00" />,

    Infrastructure: <FaBuilding className="sos-type-icon" color="#242424" />,

    Other: <PiEmptyBold className="sos-type-icon" color="#242424" />,
  };

  const filterPendingSOS = (SOSRequests) => {
    return SOSRequests.filter((req) => req.verified === false);
  };

  const fetchSOS = async () => {
    const codeOrder = ["none", "red"];
    try {
      const response = await axios.get("/api/v1/mobile/get-all-sos");
      if (response.status === 200) {
        var temp = filterPendingSOS(response.data);
        temp.sort((a, b) => {
          return codeOrder.indexOf(a.code) - codeOrder.indexOf(b.code);
        });

        setPendingSOS(temp);

        console.log(temp);

        console.log(response.data);
      }
    } catch (error) {
      toast.error("Error fetching SOS Requests. Try again later.");
      console.error(error);
    }
  };

  const sendSOS = async () => {
    console.log(currentSOS._id);
    try {
      const response = await axios.post(
        "/api/v1/mobile/verify-sos",
        { id: currentSOS._id },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        toast.success("SOS relayed successfully!");
        handleCloseResolver();
        fetchSOS();
      }
    } catch (error) {
      toast.error("Error relaying SOS. Try again later.");
      console.error(error);
    }
  };

  useEffect(() => {
    socket.on("newSos", () => {
      toast.success("New SOS!");
      console.log("new SOS");
    });

    fetchSOS();
    console.log(emergencyLocations);
    return () => {
      socket.off("newSos", () => {
        toast.success("New SOS!");
      }); // Clean up listener on unmount
    };
  }, []);

  const fetchGeoFromLocation = async (location) => {
    const results = await provider.search({ query: location });
    console.log(results);
    setCurrentSOSLocation([results[0]["y"], results[0]["x"]]);
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

  return (
    <div className="sos-display-wrapper">
      <div className="sos-display-title">
        SOS Requests ({pendingSOS.length})
      </div>
      <div className="sos-display-cards">
        {pendingSOS.map((req, idx) => {
          return (
            <Card key={idx} className="sos-display-card">
              <div className="sos-date-time-wrapper">
                <Card.Text>
                  {/* <span>Date:</span>
                  <br /> */}
                  {new Date(req.createdAt).toISOString().split("T")[0]}
                </Card.Text>
                <Card.Text>
                  {/* <span>Time:</span>
                  <br /> */}
                  {req.createdAt.split("T")[1].split(".")[0]}
                </Card.Text>
              </div>
              <div className="sos-body-icon-wrapper">
                <Card.Body>
                  <Card.Title>
                    <span className="sos-label">Emergency Type: </span>
                    <br />
                    {req.emergencyType}
                  </Card.Title>
                  <Card.Text>
                    <span className="sos-label">Location:</span>
                    <br />
                    {req.city && req.state ? (
                      <>
                        {req.city === "N/A" ? req.district : req.city},{" "}
                        {req.state}
                      </>
                    ) : (
                      <>{req.location}</>
                    )}
                  </Card.Text>
                  <Card.Text>
                    <span className="sos-label">Code: </span>
                    {req.code === "red" ? (
                      <span className="sos-code red">RED</span>
                    ) : (
                      <span className="sos-code">NORMAL</span>
                    )}
                  </Card.Text>
                </Card.Body>
                {emergencyIconMap[req.emergencyType]}
              </div>
              <Button
                className="sos-resolve"
                onClick={() => handleOpenResolver(req)}
              >
                Resolve
              </Button>
            </Card>
          );
        })}
      </div>
      {currentSOS && (
        <Modal
          className="sos-resolver"
          show={show}
          onHide={handleCloseResolver}
        >
          <Modal.Header closeButton>
            <Modal.Title>SOS Resolver</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="sos-details-wrapper">
              <div className="sos-group-wrapper">
                <div className="sos-resolver-name">
                  <span>Name:</span>
                  {currentSOS.name}
                </div>
                <div className="sos-resolver-location">
                  <span>Location:</span>
                  {currentSOS.city && currentSOS.state ? (
                    <>
                      {currentSOS.city === "N/A"
                        ? currentSOS.district
                        : currentSOS.city}
                      , {currentSOS.state}
                    </>
                  ) : (
                    <>{currentSOS.location}</>
                  )}
                </div>
              </div>
              <div className="sos-group-wrapper">
                <div className="sos-resolver-email">
                  <span>Phone:</span>
                  +91 {currentSOS.mobileNo}
                </div>
                <div className="sos-resolver-type">
                  <span>Type:</span>
                  {currentSOS.emergencyType}
                </div>
                <div className="sos-resolver-code">
                  <span>Code:</span>
                  {currentSOS.code === "red" ? (
                    <span className="sos-code red">RED</span>
                  ) : (
                    <span className="sos-code">NORMAL</span>
                  )}
                </div>
              </div>
            </div>
            <div className="map-wrapper">
              <MapContainer center={[23, 80]} zoom={5} scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors&ensp;'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {emergencyLocations.hospitals.map((location, idx) => {
                  return (
                    <Marker
                      key={idx}
                      position={[location.latitude, location.longitude]}
                      icon={medicIcon}
                    >
                      <Popup>{location.hospital_name}</Popup>
                    </Marker>
                  );
                })}
                {emergencyLocations.fireStations.map((location, idx) => {
                  return (
                    <Marker
                      key={idx}
                      position={[
                        location.gpsCoordinates.latitude,
                        location.gpsCoordinates.longitude,
                      ]}
                      icon={fireIcon}
                    >
                      <Popup>{location.title}</Popup>
                    </Marker>
                  );
                })}
                {emergencyLocations.police_stations.map((location, idx) => {
                  return (
                    <Marker
                      key={idx}
                      position={[location.latitude, location.longitude]}
                      icon={policeIcon}
                    >
                      <Popup>{location.station_name}</Popup>
                    </Marker>
                  );
                })}

                <Marker position={currentSOSLocation} icon={sosIcon}>
                  <Popup>
                    {currentSOS.name}
                    <br />
                    {currentSOS.mobileNo}
                    <br />
                    {currentSOS.emergencyType}
                  </Popup>
                </Marker>

                <SetViewOnClick location={currentSOSLocation} />
              </MapContainer>
            </div>
            {/* <Form>
              <Form.Group className="mb-3">
                <Form.Label>Emergency Type</Form.Label>
                <Form.Select
                  value={currentSOS.emergencyType}
                  onChange={(e) =>
                    setCurrentSOS({
                      ...currentSOS,
                      emergencyType: e.target.value,
                    })
                  }
                >
                  <option defaultValue disabled>
                    Select Emergency Type
                  </option>
                  <option value="Natural Disaster">Natural Disaster</option>
                  <option value="Medical">Medical</option>
                  <option value="Fire">Fire</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Form> */}
          </Modal.Body>
          <Modal.Footer>
            <Button className="send-sos-button sos-resolve" onClick={sendSOS}>
              Send SOS
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default SOSDisplay;
