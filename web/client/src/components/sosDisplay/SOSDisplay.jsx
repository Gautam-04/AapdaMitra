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

// import
import { OpenStreetMapProvider } from "leaflet-geosearch";
const provider = new OpenStreetMapProvider();
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Icon, LatLng } from "leaflet";

const SOSDisplay = () => {
  const [pendingSOS, setPendingSOS] = useState([]);
  const [currentSOS, setCurrentSOS] = useState(null);
  const [currentSOSLocation, setCurrentSOSLocation] = useState([23, 80]);
  const [show, setShow] = useState(false);

  const sosIcon = new Icon({
    iconUrl:
      "https://www.freeiconspng.com/thumbs/alert-icon/alert-icon-red-11.png",
    iconSize: [58, 50],
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
    try {
      const response = await axios.get("/api/v1/mobile/get-all-sos");
      if (response.status === 200) {
        setPendingSOS(filterPendingSOS(response.data));
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
        toast.success("SOS sent successfully!");
        handleCloseResolver();
        fetchSOS();
      }
    } catch (error) {
      toast.error("Error sending SOS. Try again later.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSOS();
  }, []);

  const fetchGeoFromLocation = async (location) => {
    const results = await provider.search({ query: location });
    console.log(results);
    setCurrentSOSLocation([results[0]["y"], results[0]["x"]]);
  };

  function SetViewOnClick(location) {
    const map = useMap();
    if (location) {
      map.panTo([location["location"][0], location["location"][1]]);
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
              <div className="sos-body-icon-wrapper">
                <Card.Body>
                  <Card.Title>
                    <span>Emergency Type: </span>
                    <br />
                    {req.emergencyType}
                  </Card.Title>
                  <Card.Text>
                    <span>Location:</span>
                    <br />
                    {req.location}
                  </Card.Text>
                  <Card.Text>
                    <span>Date:</span>
                    <br />
                    {new Date(req.createdAt).toISOString().split("T")[0]}
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
                  {currentSOS.location}
                </div>
              </div>
              <div className="sos-group-wrapper">
                <div className="sos-resolver-email">
                  <span>Email:</span>
                  {currentSOS.email}
                </div>
                <div className="sos-resolver-type">
                  <span>Type:</span>
                  {currentSOS.emergencyType}
                </div>
              </div>
            </div>
            <div className="map-wrapper">
              <MapContainer center={[23, 80]} zoom={5} scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors&ensp;'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={currentSOSLocation} icon={sosIcon}>
                  <Popup>{currentSOS.emergencyType}</Popup>
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
