import React, { useEffect, useState } from "react";
import "./CornerMenu.css";
import { FiPlusCircle } from "react-icons/fi";
import { RiRobot2Fill } from "react-icons/ri";
import { FaBroadcastTower } from "react-icons/fa";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import { MdSend } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

const CornerMenu = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [newBroadcast, setNewBroadcast] = useState({
    title: "",
    description: "",
    mode: "",
  });
  const [botHistory, setBotHistory] = useState([]);
  const [messageContent, setMessageContent] = useState("");

  const handleOpenBroadcastMessage = () => {
    setShowBroadcast(true);
  };
  const handleCloseBroadcastMessage = () => {
    setShowBroadcast(false);
  };
  const handleOpenChatbot = () => {
    sendMessage(true);
    setShowChatbot(true);
  };
  const handleCloseChatbot = () => {
    setBotHistory([]);
    setShowChatbot(false);
  };

  const sendMessage = async (blank) => {
    if (blank === true) {
      setBotHistory([]);
    } else {
      setBotHistory([...botHistory, { role: "user", content: messageContent }]);
      setMessageContent("");
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/chatbot/chat",
        { messages: botHistory },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        // setBotHistory([
        //   ...botHistory,
        //   {
        //     role: "bot",
        //     content: response.data.message,
        //   },
        // ]);
        console.log(botHistory);
        console.log(response.data.message);
      }
    } catch (error) {
      toast.error("Error sending message. Try again later.");
      console.error(error);
    }
  };

  // Create new fundraiser
  const sendBroadcast = async () => {
    try {
      const response = await axios.post("", newBroadcast, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 201) {
        toast.success("Broadcast sent successfully!");
        setShowBroadcast(false);
        setNewBroadcast({ title: "", description: "", mode: "" });
      }
    } catch (error) {
      toast.error("Error sending broadcast. Try again later.");
      console.error(error);
    }
  };

  //   useEffect(() => {
  //     sendMessage();
  //   }, [showChatbot]);

  return (
    <div className="corner-menu-wrapper">
      <Dropdown className="corner-menu-dropdown">
        <Dropdown.Toggle className="corner-menu-dropdown-toggle">
          <FiPlusCircle className="corner-menu-icon" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item
            className="corner-menu-dropdown-item"
            onClick={handleOpenBroadcastMessage}
          >
            Brodcast a Message{" "}
            <FaBroadcastTower className="corner-menu-dropdown-icon" />
          </Dropdown.Item>
          <Dropdown.Item
            className="corner-menu-dropdown-item"
            onClick={handleOpenChatbot}
          >
            AapdaMitraBot <RiRobot2Fill className="corner-menu-dropdown-icon" />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Chatbot Modal */}
      <Modal
        className="chatbot-modal"
        show={showChatbot}
        onHide={handleCloseChatbot}
      >
        <Modal.Header closeButton>
          <Modal.Title>AapdaMitraBot</Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <input
            className="chatbot-textbox"
            type="text"
            placeholder="Enter message"
            value={messageContent}
            onChange={(e) => setMessageContent((prev) => e.target.value)}
          />
          <Button
            className="chatbot-send-button"
            onClick={() => sendMessage(false)}
          >
            <MdSend />
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Broadcast Message Modal */}
      <Modal
        className=""
        show={showBroadcast}
        onHide={handleCloseBroadcastMessage}
      >
        <Modal.Header closeButton>
          <Modal.Title>Broadcast Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Message Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={newBroadcast.title}
                onChange={(e) =>
                  setNewBroadcast({ ...newBroadcast, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={newBroadcast.description}
                onChange={(e) =>
                  setNewBroadcast({
                    ...newBroadcast,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message Description</Form.Label>
              <Form.Select
                value={newBroadcast.description}
                onChange={(e) =>
                  setNewBroadcast({
                    ...newBroadcast,
                    mode: e.target.value,
                  })
                }
              >
                <option defaultValue disabled>
                  Select Mode
                </option>
                <option value="sms">SMS</option>
                <option value="push">Push Notification (through App)</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={sendBroadcast}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CornerMenu;
