// import React, { useState, useEffect } from "react";
// import { Avatar, Dropdown, Button, Space, Typography } from "antd";
// import {
//   UserOutlined,
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   SettingOutlined,
//   LogoutOutlined,
// } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
// import logo from "./Assets/textLogo.png";
// import tLogo from "./Assets/tlogo.png";

// const { Text } = Typography;

// const Header = ({ collapsed, toggleSidebar }) => {
//   const navigate = useNavigate();
//   const [isMobile, setIsMobile] = useState(false);

//   // useEffect(() => {
//   //   const handleResize = () => {
//   //     setIsMobile(window.innerWidth <= 768);
//   //   };
//   //   window.addEventListener("resize", handleResize);
//   //   handleResize();
//   //   return () => window.removeEventListener("resize", handleResize);
//   // }, []);

//   const handleMenuClick = ({ key }) => {
//     if (key === "1") {
//       navigate("/settings");
//     } else if (key === "2") {
//       navigate("/profile");
//     } else if (key === "3") {
//       localStorage.removeItem("isLoggedIn");
//       navigate("/");
//       window.location.reload(); // Ensure fresh login state
//     }
//   };

//   const userMenu = {
//     items: [
//       {
//         key: "1",
//         icon: <SettingOutlined />,
//         label: "Settings",
//       },
//       {
//         key: "2",
//         icon: <UserOutlined />,
//         label: "Profile",
//       },
//       {
//         key: "3",
//         icon: <LogoutOutlined />,
//         label: "Logout",
//       },
//     ],
//     onClick: handleMenuClick,
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         padding: "0 16px",
//         background: "#162566",
//         height: "64px",
//         position: "sticky",
//         top: 0,
//         zIndex: 1000,
//         boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           flexGrow: 1,
//           gap: "10px",
//         }}
//       >
//         <img
//           src={tLogo}
//           alt="TLogo"
//           style={{
//             width: "35px",
//             height: "35px",
//             transition: "all 0.3s ease",
//           }}
//         />
//         <img
//           src={logo}
//           alt="Logo"
//           style={{
//             height: "30px",
//             transition: "all 0.3s ease",
//           }}
//         />
//       </div>
//       <Button
//         type="text"
//         icon={
//           collapsed ? (
//             <MenuUnfoldOutlined style={{ color: "white" }} />
//           ) : (
//             <MenuFoldOutlined style={{ color: "white" }} />
//           )
//         }
//         onClick={toggleSidebar}
//       />
//       {/* <Dropdown menu={userMenu} placement="bottomRight">
//         <Space>
//           <Avatar size={30} icon={<UserOutlined />} />
//         </Space>
//       </Dropdown> */}
//     </div>
//   );
// };

// export default Header;
import { Button, Typography } from "antd";
import { MenuOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "./Assets/textLogo.png";
import tLogo from "./Assets/tlogo.png";

const { Text } = Typography;

const Header = ({ setOpen }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        background: "#162566",
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          gap: "5px",
        }}
      >
        <img
          src={tLogo}
          alt="TLogo"
          style={{
            width: "35px",
            height: "35px",
            transition: "all 0.3s ease",
          }}
        />
        <img
          src={logo}
          alt="Logo"
          style={{
            height: "30px",
            transition: "all 0.3s ease",
          }}
        />
      </div>
      <Button
        type="text"
        icon={<MenuOutlined style={{ color: "white", fontSize: "20px" }} />}
        onClick={() => {
          setOpen(true);
        }}
      />
      {/* <Dropdown menu={userMenu} placement="bottomRight">
        <Space>
          <Avatar size={30} icon={<UserOutlined />} />
        </Space>
      </Dropdown> */}
    </div>
  );
};

export default Header;
