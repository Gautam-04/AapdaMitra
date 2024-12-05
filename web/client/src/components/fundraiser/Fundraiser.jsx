import { useEffect, useState } from "react";
import Footer from "../footer/Footer";
import Header from "../header/header";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiSolidBookOpen } from "react-icons/bi";
import "./Fundraiser.css";
import { useTranslation } from "react-i18next";

function Fundraiser() {
  const [fundraisers, setFundraisers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const [newFundraiser, setNewFundraiser] = useState({
    title: "",
    fullForm: "",
    description: "",
    goal: "",
    logo: "",
  });

  const navigate = useNavigate();

  // Fetch all fundraisers
  const fetchFundraisers = async () => {
    try {
      const response = await axios.get("/api/v1/mobile/get-fundraisers");
      if (response.status === 200) {
        setFundraisers(response.data.fundraiser);
      }
    } catch (error) {
      toast.error("Error fetching fundraisers. Try again later.");
      console.error(error);
    }
  };

  // Create new fundraiser
  const createFundraiser = async () => {
    try {
      const response = await axios.post(
        "/api/v1/donation/create-fundraiser",
        newFundraiser,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 201) {
        toast.success("Fundraiser created successfully!");
        setShowModal(false);
        fetchFundraisers();
      }
    } catch (error) {
      toast.error("Error creating fundraiser. Try again later.");
      console.error(error);
    }
  };

  // Delete fundraiser
  const deleteFundraiser = async (id) => {
    try {
      const response = await axios.delete(`/api/v1/donation/delete/${id}`);
      if (response.status === 200) {
        toast.success("Fundraiser deleted successfully!");
        fetchFundraisers();
      }
    } catch (error) {
      toast.error("Error deleting fundraiser. Try again later.");
      console.error(error);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setNewFundraiser((prevState) => ({
        ...prevState,
        logo: base64,
      }));
    }
  };

  useEffect(() => {
    fetchFundraisers();
  }, []);

  return (
    <>
      <div className="fundraiser-container">
        <div className="fundraiser-title-button-wrapper">
          <div className="fundraiser-title">{t("fundraiser_title")}</div>
          <Button
            variant="primary"
            className="create-new-fund"
            onClick={() => setShowModal(true)}
          >
            <span>{t("fundraiser_create_fund")}</span> <FaPlus />
          </Button>
        </div>

        <div className="fundraiser-cards">
          {fundraisers.map((fundraiser) => (
            <Card
              key={fundraiser._id}
              style={{ width: "18rem", margin: "10px" }}
            >
              <Card.Img
                variant="top"
                src={fundraiser.logo || "https://via.placeholder.com/150"}
                alt="Fundraiser Logo"
              />
              <Card.Body>
                <Card.Text>{fundraiser.description}</Card.Text>
                <div className="card-body-bottom">
                  <Card.Title>
                    {fundraiser.title.substring(0, 5)}{" "}
                    {fundraiser.title.length >= 5 && "..."}
                  </Card.Title>
                  <div className="card-body-bottom-buttons">
                    <Button
                      className="fundraiser-view"
                      variant="success"
                      onClick={() => navigate(`/donations/${fundraiser._id}`)}
                    >
                      <BiSolidBookOpen />
                    </Button>{" "}
                    <Button
                      className="fundraiser-delete"
                      variant="danger"
                      onClick={() => deleteFundraiser(fundraiser._id)}
                    >
                      <MdDelete />
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal for Creating Fundraiser */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("fundraiser_create_fund")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{t("fundraiser_create_fund_title")}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter fundraiser title"
                value={newFundraiser.title}
                onChange={(e) =>
                  setNewFundraiser({ ...newFundraiser, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t("fundraiser_create_fund_ff")}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full form"
                value={newFundraiser.fullForm}
                onChange={(e) =>
                  setNewFundraiser({
                    ...newFundraiser,
                    fullForm: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t("fundraiser_create_fund_desc")}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={newFundraiser.description}
                onChange={(e) =>
                  setNewFundraiser({
                    ...newFundraiser,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t("fundraiser_create_fund_goal")}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter fundraiser Goal in Rs."
                value={newFundraiser.goal}
                onChange={(e) =>
                  setNewFundraiser({
                    ...newFundraiser,
                    goal: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t("fundraiser_create_fund_file")}</Form.Label>
              <Form.Control type="file" onChange={handleFileUpload} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t("fundraiser_create_close")}
          </Button>
          <Button variant="primary" onClick={createFundraiser}>
            {t("fundraiser_create_create_button")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Fundraiser;
