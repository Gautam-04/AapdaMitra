/* eslint-disable react/jsx-key */
import { useState } from "react";
import "./Dashboard.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/Footer";
import Analytics from "../../components/analytics/Analytics";
import Searchbar from "../../components/searchbar/searchbar";
import Search from "../../components/Search/Search";
import { MdCrisisAlert, MdOutlineAnalytics } from "react-icons/md";
import { RiRefund2Fill } from "react-icons/ri";
import { IoSearch } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
import { icon } from "leaflet";
import Fundraiser from "../../components/Fundraiser/Fundraiser";
import { useTranslation } from "react-i18next";
import SOSDisplay from "../../components/sosDisplay/SOSDisplay";

const Dashboard = () => {
  const [dashboardPage, setDashboardPage] = useState("Analytics");
  const [SOSToggle, setSOSToggle] = useState(true);
  const { t } = useTranslation();
  const sidebarContent = [
    {
      name: t("dashboard_analytics"),
      icon: <MdOutlineAnalytics className="sidebar-icon" />,
      to: "Analytics",
      color: "white",
    },
    {
      name: t("dashboard_search"),
      icon: <IoSearch className="sidebar-icon" />,
      to: "Search",
      color: "white",
    },
    {
      name: t("dashboard_donations"),
      icon: <RiRefund2Fill className="sidebar-icon" />,
      to: "Donations",
      color: "white",
    },
  ];
  return (
    <>
      <Header />
      <div className="dashboard-wrapper">
        <div className="dashboard-sidebar">
          {sidebarContent.map((sidebarItem, idx) => {
            return (
              <div
                className="sidebar-item"
                onClick={() => setDashboardPage(sidebarItem.to)}
                style={{
                  backgroundColor: `${
                    sidebarItem.to === dashboardPage
                      ? "var(--primary-color)"
                      : "white"
                  }`,
                  color: `${
                    sidebarItem.to === dashboardPage
                      ? "white"
                      : "var(--primary-color)"
                  }`,
                  fontWeight: `${sidebarItem.to === dashboardPage ? 600 : 400}`,
                }}
              >
                <div className="sidebar-content-wrapper">
                  <div className="sidebar-item-icon">{sidebarItem.icon}</div>
                  <div className="sidebar-item-text">{sidebarItem.name}</div>
                </div>
                <MdKeyboardArrowRight
                  size="2rem"
                  color={
                    sidebarItem.to === dashboardPage
                      ? "white"
                      : "var(--primary-color)"
                  }
                />
              </div>
            );
          })}
          <div className="sos-toggle">
            <div
              className="sidebar-item"
              onClick={() => setSOSToggle((prev) => !prev)}
              style={{
                backgroundColor: `${
                  SOSToggle ? "var(--primary-color)" : "white"
                }`,
                color: `${SOSToggle ? "white" : "var(--primary-color)"}`,
                fontWeight: `${setSOSToggle ? 600 : 400}`,
              }}
            >
              <div className="sidebar-content-wrapper">
                <div className="sidebar-item-icon">
                  <MdCrisisAlert className="sidebar-icon" />
                </div>
                <div className="sidebar-item-text">
                  {SOSToggle ? "Hide SOS" : "Show SOS"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-content">
          {dashboardPage === "Analytics" && <Analytics />}
          {dashboardPage === "Search" && <Search />}
          {dashboardPage === "Donations" && <Fundraiser />}
        </div>
        {SOSToggle && (
          <div className="dashboard-sos">
            <SOSDisplay />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
