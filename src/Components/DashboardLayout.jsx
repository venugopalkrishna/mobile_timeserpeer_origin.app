import React, { useState, useEffect, useRef } from "react";
import { Layout } from "antd";
import Header from "./Header";
import Sidebar from "./Sidebar";
import logo1 from "../Components/Assets/tlogo.png"; // Collapsed logo
import { CloseOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth <= 768);
  //   };
  //   window.addEventListener("resize", handleResize);
  //   handleResize();
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       isMobile &&
  //       sidebarRef.current &&
  //       !sidebarRef.current.contains(event.target) &&
  //       !event.target.closest(".ant-menu")
  //     ) {
  //       setCollapsed(true);
  //     }
  //   };

  //   if (isMobile) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [isMobile]);

  return (
    <Layout style={{ minHeight: "100vh", minWidth: "220px" }}>
      {/* Sidebar */}
      {collapsed === true ? (
        <>
          <div
            style={{
              padding: "5px",
              display: "flex", // Enables flexbox
              alignItems: "center", // Aligns items vertically
              justifyContent: "space-between", // Pushes items to opposite ends
              backgroundColor: "#150A4E",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
              transition: "all 0.3s ease",
              position: "sticky",
              top: 0,
              zIndex: 101,
            }}
          >
            {/* Logo on the left */}
            <img
              src={logo1}
              alt="Logo"
              style={{
                width: "35px",
                height: "35px",
                transition: "all 0.3s ease",
              }}
            />

            {/* Close Icon on the right */}
            <CloseOutlined
              style={{
                fontSize: "24px", // Adjust size as needed
                color: "white", // Optional: change color
                cursor: "pointer", // Make it clickable
              }}
              onClick={() => {
                setCollapsed(false);
              }}
            />
          </div>
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          {/* <div
            style={{
              padding: "10px",
              textAlign: "center",
              color: "#fff",
              position: "absolute",
              bottom: 0,
              width: "100%",
              backgroundColor: "#150A4E",
              borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {collapsed ? "V - 1.0" : "@TimeseraERP Pvt Ltd - Version 1.0"}
          </div> */}
        </>
      ) : (
        <Layout>
          <Header collapsed={collapsed} toggleSidebar={toggleSidebar} />
          <Content
            style={{
              margin: "10px",
              padding: "7px",
              backgroundColor: "#f4f4f4",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              // transition: "all 0.3s ease",
            }}
          >
            {children}
          </Content>
        </Layout>
      )}
    </Layout>
  );
};

export default DashboardLayout;
