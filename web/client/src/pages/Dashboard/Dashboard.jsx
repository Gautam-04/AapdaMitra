// /* eslint-disable react/jsx-key */
// import { useState } from "react";
// import "./Dashboard.css";
// import Header from "../../components/header/header";
// import Footer from "../../components/footer/Footer";
// import Analytics from "../../components/analytics/Analytics";
// import Searchbar from "../../components/searchbar/searchbar";
// import CornerMenu from "../../components/cornerMenu/CornerMenu";
// import Search from "../../components/Search/Search";
// import { MdCrisisAlert, MdOutlineAnalytics } from "react-icons/md";
// import { RiRefund2Fill } from "react-icons/ri";
// import { IoSearch } from "react-icons/io5";
// import { TiWeatherPartlySunny } from "react-icons/ti";
// import { MdKeyboardArrowRight } from "react-icons/md";
// import Fundraiser from "../../components/Fundraiser/Fundraiser";
// import { useTranslation } from "react-i18next";
// import SOSDisplay from "../../components/sosDisplay/SOSDisplay";
// import { useNavigate, useParams } from "react-router-dom";
// import Forecasting from "../../components/forecasting/Forecasting";
// import { TbReportAnalytics } from "react-icons/tb";
// import ReportGen from "../../components/report-gen/ReportGen";

// const Dashboard = () => {
//   const [SOSToggle, setSOSToggle] = useState(false);
//   const { t } = useTranslation();
//   const { tab } = useParams();
//   const [dashboardPage, setDashboardPage] = useState(tab);
//   let navigateContent = useNavigate();

//   const changeSidebarContent = (path) => {
//     navigateContent(`/dashboard/${path}`);
//     setDashboardPage(path);
//   };

//   const sidebarContentTop = [
//     {
//       name: t("dashboard_analytics"),
//       icon: <MdOutlineAnalytics className="sidebar-icon" />,
//       to: "analytics",
//       color: "white",
//     },
//     // {
//     //   name: t("dashboard_search"),
//     //   icon: <IoSearch className="sidebar-icon" />,
//     //   to: "search",
//     //   color: "white",
//     // },
//     // {
//     //   name: t("dashboard_donations"),
//     //   icon: <RiRefund2Fill className="sidebar-icon" />,
//     //   to: "donations",
//     //   color: "white",
//     // },
//     {
//       name: "Forecasting",
//       icon: <TiWeatherPartlySunny className="sidebar-icon" />,
//       to: "forecasting",
//       color: "white",
//     },
//   ];

//   const sidebarContentBottom = [
//     // {
//     //   name: "Report Generation",
//     //   icon: <TbReportAnalytics className="sidebar-icon" />,
//     //   to: "report-gen",
//     //   color: "white",
//     // },
//   ];

//   return (
//     <>
//       <Header />
//       <CornerMenu />
//       <div className="dashboard-wrapper">
//         <div className="dashboard-sidebar">
//           {sidebarContentTop.map((sidebarItem, idx) => {
//             return (
//               <div
//                 className="sidebar-item"
//                 onClick={() => changeSidebarContent(sidebarItem.to)}
//                 key={idx}
//                 style={{
//                   backgroundColor: `${
//                     sidebarItem.to === dashboardPage
//                       ? "var(--primary-color)"
//                       : "white"
//                   }`,
//                   color: `${
//                     sidebarItem.to === dashboardPage
//                       ? "white"
//                       : "var(--primary-color)"
//                   }`,
//                   fontWeight: `${sidebarItem.to === dashboardPage ? 600 : 400}`,
//                 }}
//               >
//                 <div className="sidebar-content-wrapper">
//                   <div className="sidebar-item-icon">{sidebarItem.icon}</div>
//                   <div className="sidebar-item-text">{sidebarItem.name}</div>
//                 </div>
//                 <MdKeyboardArrowRight
//                   size="2rem"
//                   color={
//                     sidebarItem.to === dashboardPage
//                       ? "white"
//                       : "var(--primary-color)"
//                   }
//                 />
//               </div>
//             );
//           })}
//           <div className="sos-toggle">
//             <div
//               className="sidebar-item"
//               onClick={() => setSOSToggle((prev) => !prev)}
//               style={{
//                 backgroundColor: `${
//                   SOSToggle ? "var(--primary-color)" : "white"
//                 }`,
//                 color: `${SOSToggle ? "white" : "var(--primary-color)"}`,
//                 fontWeight: `${setSOSToggle ? 600 : 400}`,
//               }}
//             >
//               <div className="sidebar-content-wrapper">
//                 <div className="sidebar-item-icon">
//                   <MdCrisisAlert className="sidebar-icon" />
//                 </div>
//                 <div className="sidebar-item-text">
//                   {SOSToggle ? "Hide SOS" : "Show SOS"}
//                 </div>
//               </div>
//             </div>
//           </div>
//           {sidebarContentBottom.map((sidebarItem, idx) => {
//             return (
//               <div
//                 className="sidebar-item"
//                 onClick={() => changeSidebarContent(sidebarItem.to)}
//                 key={idx}
//                 style={{
//                   backgroundColor: `${
//                     sidebarItem.to === dashboardPage
//                       ? "var(--primary-color)"
//                       : "white"
//                   }`,
//                   color: `${
//                     sidebarItem.to === dashboardPage
//                       ? "white"
//                       : "var(--primary-color)"
//                   }`,
//                   fontWeight: `${sidebarItem.to === dashboardPage ? 600 : 400}`,
//                 }}
//               >
//                 <div className="sidebar-content-wrapper">
//                   <div className="sidebar-item-icon">{sidebarItem.icon}</div>
//                   <div className="sidebar-item-text">{sidebarItem.name}</div>
//                 </div>
//                 <MdKeyboardArrowRight
//                   size="2rem"
//                   color={
//                     sidebarItem.to === dashboardPage
//                       ? "white"
//                       : "var(--primary-color)"
//                   }
//                 />
//               </div>
//             );
//           })}
//         </div>
//         <div className="dashboard-content">
//           {dashboardPage === "analytics" && <Analytics />}
//           {dashboardPage === "search" && <Search />}
//           {dashboardPage === "donations" && <Fundraiser />}
//           {dashboardPage === "forecasting" && <Forecasting />}
//           {dashboardPage === "report-gen" && <ReportGen />}
//         </div>
//         {SOSToggle && (
//           <div className="dashboard-sos">
//             <SOSDisplay />
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Dashboard;

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js/auto";
import { Line } from "react-chartjs-2";
import Header from "../../components/header/header";
import Footer from "../../components/footer/Footer";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

function Dashboard() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [timelineInputVisible, setTimelineInputVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isPopupVisible, setPopupVisibility] = useState(false);
  const [inputStart, setInputStart] = useState("");
  const [inputEnd, setInputEnd] = useState("");
  const [spinnerActive, setSpinnerActive] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const executeTimelineFetch = async () => {
    if (!inputStart || !inputEnd) {
      setPopupMessage("Enter valid start and end dates!");
      return;
    }

    setSpinnerActive(true);
    setPopupMessage("");

    try {
      const apiResponse = await fetch(
        "http://localhost:8000/v1/jaldibanao/timeline",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ startDate: inputStart, endDate: inputEnd }),
        }
      );

      if (!apiResponse.ok) {
        throw new Error("Request failed");
      }

      const reportData = await apiResponse.json();
      setPopupMessage(reportData["daily-report"]);
    } catch (fetchError) {
      setPopupMessage("Error fetching report");
    } finally {
      setSpinnerActive(false);
    }
  };

  const fetchDailyReport = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        "http://localhost:8000/v1/jaldibanao/dailyreport"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch daily report");
      }
      const data = await response.json();
      setReport(data["daily-report"]); // Assuming `daily-report` is the key in the JSON response
    } catch (error) {
      setError("Error fetching daily report");
    } finally {
      setIsLoading(false);
      setShow(true);
    }
  };

  // const fetchTimelineReport = async () => {
  //   if (!fromDate || !toDate) {
  //     setModalContent('Please provide both From and To dates.');
  //     setModalVisible(true);
  //     return;
  //   }

  //   try {
  //     const response = await fetch('http://localhost:8000/v1/jaldibanao/timelinereport', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ from: fromDate, to: toDate }),
  //     });
  //     const data = await response.json();
  //     setModalContent(JSON.stringify(data, null, 2));
  //     setModalVisible(true);
  //   } catch (error) {
  //     setModalContent('Error fetching timeline report');
  //     setModalVisible(true);
  //   }
  // };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent("");
  };

  // Updated disaster cards with brighter, lighter color palette
  const disasterCards = [
    {
      title: "Floods",
      impactedAreas: 17,
      backgroundGradient: "linear-gradient(135deg, #E6F3FF 0%, #B3E0FF 100%)",
      shadowColor: "rgba(79, 195, 247, 0.3)",
      textColor: "#00497a",
      hoverShadow: "0 15px 30px rgba(79, 195, 247, 0.4)",
    },
    {
      title: "Cyclones",
      impactedAreas: 12,
      backgroundGradient: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)",
      shadowColor: "rgba(255, 152, 0, 0.3)",
      textColor: "#a45d00",
      hoverShadow: "0 15px 30px rgba(255, 152, 0, 0.4)",
    },
    {
      title: "Landslides",
      impactedAreas: 8,
      backgroundGradient: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
      shadowColor: "rgba(76, 175, 80, 0.3)",
      textColor: "#2e7d32",
      hoverShadow: "0 15px 30px rgba(76, 175, 80, 0.4)",
    },
    {
      title: "Earthquakes",
      impactedAreas: 5,

      backgroundGradient: "linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)",
      shadowColor: "rgba(156, 39, 176, 0.3)",
      textColor: "#6a1b9a",
      hoverShadow: "0 15px 30px rgba(156, 39, 176, 0.4)",
    },
  ];

  // Dummy data for multiline graph
  const lineChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "India",
        data: [15, 20, 25, 18, 30, 35, 40, 32, 25, 20, 15, 10],
        borderColor: "#1f77b4",
        backgroundColor: "rgba(31, 119, 180, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "World Total",
        data: [5, 23, 20, 25, 38, 40, 20, 45, 40, 30, 20, 16],
        borderColor: "#ff7f0e",
        backgroundColor: "rgba(255, 127, 14, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(200, 200, 200, 0.3)",
        },
      },
    },
  };

  const renderDisasterCard = (card) => (
    <div
      style={{
        background: card.backgroundGradient,
        borderRadius: "15px",
        padding: "20px",
        color: card.textColor,
        textAlign: "left",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        boxShadow: "0 10px 20px " + card.shadowColor,
        height: "250px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
      className="hover:scale-105 hover:shadow-xl"
      // Inline style for hover effect
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = card.hoverShadow;
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 10px 20px " + card.shadowColor;
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <div>
        <h3
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          {card.title}
        </h3>
        <p
          style={{
            fontSize: "0.9rem",
            marginBottom: "10px",
          }}
        >
          {card.description}
        </p>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          <span>This Month:</span>
          <span>{card.impactedAreas}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div
        style={{
          padding: "40px",
          backgroundColor: "#f4f7f6",
          minHeight: "calc(100vh - 200px)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "2rem",
            fontWeight: "600",
          }}
        >
          Disaster Insights
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={fetchDailyReport}
            style={{
              padding: "10px 20px",
              background: "#2B3674",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Generate Daily Report
          </button>

          <button
            onClick={() => setPopupVisibility(true)}
            style={{
              padding: "10px 20px",
              background: "#2B3674",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Fetch Timeline Report
          </button>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Daily Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isLoading ? (
              <div style={{ textAlign: "center" }}>
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div style={{ color: "red" }}>{error}</div>
            ) : (
              <div id="printableContent">
                <ReactMarkdown>{report}</ReactMarkdown>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const printableArea =
                  document.getElementById("printableContent");
                if (printableArea) {
                  const newWindow = window.open("", "_blank");
                  newWindow.document.write(
                    "<html><head><title>Print</title></head><body>"
                  );
                  newWindow.document.write(printableArea.innerHTML);
                  newWindow.document.write("</body></html>");
                  newWindow.document.close();
                  newWindow.print();
                }
              }}
            >
              Print
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={isPopupVisible} onHide={() => setPopupVisibility(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Fetch Timeline Based Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!spinnerActive && !popupMessage && (
              <div>
                <div style={{ marginBottom: "1rem" }}>
                  <label>Start Date:</label>
                  <input
                    type="datetime-local"
                    value={inputStart}
                    onChange={(e) => setInputStart(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                  />
                </div>
                <div>
                  <label>End Date:</label>
                  <input
                    type="datetime-local"
                    value={inputEnd}
                    onChange={(e) => setInputEnd(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                  />
                </div>
              </div>
            )}

            {spinnerActive ? (
              <div style={{ textAlign: "center" }}>
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              popupMessage && (
                <div id="printableContent">
                  <ReactMarkdown>{popupMessage}</ReactMarkdown>
                </div>
              )
            )}
          </Modal.Body>
          <Modal.Footer>
            {!spinnerActive && !popupMessage && (
              <Button variant="primary" onClick={executeTimelineFetch}>
                Get Report
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => setPopupVisibility(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const printableArea =
                  document.getElementById("printableContent");
                if (printableArea) {
                  const newWindow = window.open("", "_blank");
                  newWindow.document.write(
                    "<html><head><title>Print</title></head><body>"
                  );
                  newWindow.document.write(printableArea.innerHTML);
                  newWindow.document.write("</body></html>");
                  newWindow.document.close();
                  newWindow.print();
                }
              }}
            >
              Print
            </Button>
          </Modal.Footer>
        </Modal>

        {modalVisible && (
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "10px",
                width: "80%",
                maxWidth: "500px",
                textAlign: "center",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h3>Report</h3>
              <pre
                style={{
                  textAlign: "left",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  background: "#f4f4f4",
                  padding: "10px",
                  borderRadius: "5px",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {modalContent}
              </pre>
              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={closeModal}
                  style={{
                    padding: "10px 20px",
                    margin: "0 10px",
                    background: "#f44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  style={{
                    padding: "10px 20px",
                    margin: "0 10px",
                    background: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
            marginBottom: "40px",
            position: "relative",
          }}
        >
          {/* Vertical Separator */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: "2px",
              background:
                "linear-gradient(to bottom, #e0e0e0, #f5f5f5, #e0e0e0)",
              transform: "translateX(-50%)",
              zIndex: 1,
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
          ></div>

          {/* India Disasters Section */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <h3
              style={{
                textAlign: "center",
                color: "#2c3e50",
                fontSize: "2rem",
                marginBottom: "20px",
                fontWeight: "500",
              }}
            >
              India
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {disasterCards.slice(0, 2).map((card, index) => (
                <div key={index}>{renderDisasterCard(card)}</div>
              ))}
              {disasterCards.slice(2, 4).map((card, index) => (
                <div key={index}>{renderDisasterCard(card)}</div>
              ))}
            </div>
          </div>

          {/* World Disasters Section */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <h3
              style={{
                textAlign: "center",
                color: "#2c3e50",
                fontSize: "2rem",
                marginBottom: "20px",
                fontWeight: "500",
              }}
            >
              World
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {disasterCards.slice(0, 2).map((card, index) => (
                <div key={index}>{renderDisasterCard(card)}</div>
              ))}
              {disasterCards.slice(2, 4).map((card, index) => (
                <div key={index}>{renderDisasterCard(card)}</div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: "400px" }}>
          <h3
            style={{
              textAlign: "center",
              color: "#2c3e50",
              fontSize: "2rem",
              marginBottom: "20px",
              fontWeight: "500",
            }}
          >
            Floods in 2024
          </h3>
          <div style={{ height: "300px", maxWidth: "800px", margin: "0 auto" }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;
