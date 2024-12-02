import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, Card, Modal } from "react-bootstrap";
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
import { LatLng } from "leaflet";

const SOSDisplay = () => {
  const [pendingSOS, setPendingSOS] = useState([]);
  const [currentSOS, setCurrentSOS] = useState(null);
  const [currentSOSLocation, setCurrentSOSLocation] = useState([23, 80]);
  const [show, setShow] = useState(false);

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
        setPendingSOS(filterPendingSOS(response.data.splice(0, 10)));
      }
    } catch (error) {
      toast.error("Error fetching SOS Requests. Try again later.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSOS();
  }, []);

  const fetchGeoFromLocation = async (location) => {
    const results = await provider.search({ query: location });

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
            <div className="sos-resolver-name">
              <span>Name:</span>
              {currentSOS.name}
            </div>
            <div className="sos-resolver-name">
              <span>Email:</span>
              {currentSOS.email}
            </div>
            <div className="sos-resolver-name">
              <span>Location:</span>
              {currentSOS.location}
            </div>
            <div className="map-wrapper">
              <MapContainer center={[23, 80]} zoom={5} scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors&ensp;'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={currentSOSLocation}>
                  <Popup>{currentSOS.emergencyType}</Popup>
                </Marker>
                <SetViewOnClick location={currentSOSLocation} />
              </MapContainer>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseResolver}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCloseResolver}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default SOSDisplay;
