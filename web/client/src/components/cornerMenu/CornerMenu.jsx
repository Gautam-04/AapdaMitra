import React, { useEffect, useRef, useState } from "react";
import "./CornerMenu.css";
import { FiPlusCircle } from "react-icons/fi";
import { RiRobot2Fill } from "react-icons/ri";
import { FaBroadcastTower } from "react-icons/fa";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import { MdSend } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";

const CornerMenu = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [newBroadcast, setNewBroadcast] = useState({
    title: "",
    description: "",
    mode: "",
    state: "",
  });
  const [chatHistory, setChatHistory] = useState([]);
  const [messageContent, setMessageContent] = useState("Hello");
  const chatRef = useRef(null);
  const latestMessageRef = useRef(null);

  const states = [
    {
      id: "0",
      name: "Choose...",
    },
    {
      id: "1",
      name: "Andaman and Nicobar Islands",
    },
    {
      id: "2",
      name: "Andhra Pradesh",
    },
    {
      id: "3",
      name: "Arunachal Pradesh",
    },
    {
      id: "4",
      name: "Assam",
    },
    {
      id: "5",
      name: "Bihar",
    },
    {
      id: "6",
      name: "Chandigarh",
    },
    {
      id: "7",
      name: "Chhattisgarh",
    },
    {
      id: "8",
      name: "Dadra and Nagar Haveli and Daman and Diu",
    },
    {
      id: "9",
      name: "Delhi",
    },
    {
      id: "10",
      name: "Goa",
    },
    {
      id: "11",
      name: "Gujarat",
    },
    {
      id: "12",
      name: "Haryana",
    },
    {
      id: "13",
      name: "Himachal Pradesh",
    },
    {
      id: "14",
      name: "Jammu and Kashmir",
    },
    {
      id: "15",
      name: "Jharkhand",
    },
    {
      id: "16",
      name: "Karnataka",
    },
    {
      id: "17",
      name: "Kerala",
    },
    {
      id: "18",
      name: "Ladakh",
    },
    {
      id: "19",
      name: "Lakshadweep",
    },
    {
      id: "20",
      name: "Madhya Pradesh",
    },
    {
      id: "21",
      name: "Maharashtra",
    },
    {
      id: "22",
      name: "Manipur",
    },
    {
      id: "23",
      name: "Meghalaya",
    },
    {
      id: "24",
      name: "Mizoram",
    },
    {
      id: "25",
      name: "Nagaland",
    },
    {
      id: "26",
      name: "Odisha",
    },
    {
      id: "27",
      name: "Puducherry",
    },
    {
      id: "28",
      name: "Punjab",
    },
    {
      id: "29",
      name: "Rajasthan",
    },
    {
      id: "30",
      name: "Sikkim",
    },
    {
      id: "31",
      name: "Tamil Nadu",
    },
    {
      id: "32",
      name: "Telangana",
    },
    {
      id: "33",
      name: "Tripura",
    },
    {
      id: "34",
      name: "Uttar Pradesh",
    },
    {
      id: "35",
      name: "Uttarakhand",
    },
    {
      id: "36",
      name: "West Bengal",
    },
  ];

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
    setMessageContent("Hello");
    setChatHistory([]);
    setShowChatbot(false);
  };

  const sendMessage = async (blank) => {
    if (blank === true) {
      setChatHistory([]);
    } else if (messageContent === "") {
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/chatbot/employee-chat",
        { messages: [{ role: "user", content: messageContent }] },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        // setMessageContent("");
        setChatHistory([
          ...chatHistory,
          { role: "user", content: messageContent },
          {
            role: "bot",
            content: response.data.message,
          },
        ]);
        setMessageContent("");
        // console.log("After response", chatHistory);
        // console.log(response.data.message);
      }
    } catch (error) {
      toast.error("Error sending message. Try again later.");
      console.error(error);
    }
  };

  // Create new fundraiser
  const sendBroadcast = async () => {
    try {
      var mode;
      if (newBroadcast.mode === "sms") {
        mode = "send-message";
      } else if (newBroadcast.mode === "push") {
        mode = "send-notification";
      } else {
        return;
      }
      const response = await axios.post(
        `/api/v1/mobile/${mode}`,
        newBroadcast,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        toast.success("Broadcast sent successfully!");
        setShowBroadcast(false);
        setNewBroadcast({ title: "", description: "", mode: "", state: "" });
      }
    } catch (error) {
      toast.error("Error sending broadcast. Try again later.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [chatHistory]);
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
            <FaBroadcastTower className="corner-menu-dropdown-icon" />
            Brodcast a Message
          </Dropdown.Item>
          <Dropdown.Item
            className="corner-menu-dropdown-item"
            onClick={handleOpenChatbot}
          >
            <RiRobot2Fill className="corner-menu-dropdown-icon" />
            AapdaMitraBot
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
        <Modal.Body>
          {chatHistory && (
            <div className="chat-messages-wrapper" ref={chatRef}>
              {chatHistory.map((chatItem, idx) => (
                <div
                  className="chat-message-wrapper"
                  ref={idx === chatHistory.length - 1 ? latestMessageRef : null}
                >
                  <li key={idx} className={"chat-message " + chatItem.role}>
                    {chatItem.role == "bot" ? (
                      <ReactMarkdown
                        children={chatItem.content}
                        class="md-format"
                      />
                    ) : (
                      chatItem.content
                    )}
                  </li>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <input
            className="chatbot-textbox"
            type="text"
            placeholder="Enter message"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage(false);
              }
            }}
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
        className="broadcast-message-modal"
        show={showBroadcast}
        onHide={handleCloseBroadcastMessage}
      >
        <Modal.Header closeButton>
          <Modal.Title>Broadcast Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Broadcast Title</Form.Label>
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
              <Form.Label>Broadcast Description</Form.Label>
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
                value={newBroadcast.mode}
                onChange={(e) =>
                  setNewBroadcast({
                    ...newBroadcast,
                    mode: e.target.value,
                  })
                }
              >
                <option defaultValue>Select Mode</option>
                <option value="sms">SMS</option>
                <option value="push">Push Notification (through App)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Broadcast State (Select None for all users)
              </Form.Label>
              <Form.Select
                value={newBroadcast.state}
                onChange={(e) =>
                  setNewBroadcast({
                    ...newBroadcast,
                    state: e.target.value,
                  })
                }
              >
                <option defaultValue disabled>
                  Select State
                </option>
                {states.map((state, idx) => (
                  <option key={idx}>{state.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="broadcast-send-button" onClick={sendBroadcast}>
            Broadcast
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CornerMenu;
