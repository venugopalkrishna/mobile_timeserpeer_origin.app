import React, { useState } from "react";
import { Menu, Divider, Popover } from "antd";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  AppstoreOutlined,
  FileDoneOutlined,
  ShopOutlined,
  DollarOutlined,
  TeamOutlined,
  LineChartOutlined,
  RightCircleFilled,
  LogoutOutlined,
} from "@ant-design/icons";
import logo from "../Components/Assets/textLogo.png"; // Import the logo

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [selectedKey, setSelectedKey] = useState(""); // Track the selected key for highlighting
  const [openKeys, setOpenKeys] = useState([]); // Track open submenu items

  const handleMenuClick = (e) => {
    setSelectedKey(e.key); // Update selected key on click
    if (e.key === "1") {
      setOpenKeys([]); // Close all submenus when Dashboard is clicked
    }

    // Preserve "isLoggedIn" while clearing other localStorage items
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    localStorage.clear(); // Clear all storage
    if (isLoggedIn) {
      localStorage.setItem("isLoggedIn", isLoggedIn); // Restore "isLoggedIn"
    }
  };

  const handleSubMenuOpenChange = (keys) => {
    setOpenKeys(keys.length ? [keys[keys.length - 1]] : []); // Only keep the last opened submenu
  };

  const handleLogOut = () => {
      localStorage.removeItem("isLoggedIn");
      window.location.reload();
  };

  const iconStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    color: "#000",
    width: "24px",
    height: "24px",
    borderRadius: "5px",
    padding: "0px",
  };

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined style={iconStyle} />,
      label: (
        <Link
          onClick={() => {
            setCollapsed(false);
          }}
          to="/estimations"
          style={{ color: "#fff" }}
        >
          Estimations
        </Link>
      ),
      style: !collapsed
        ? {
            backgroundColor: "#52BD91", // Light green background for Dashboard
            borderRadius: "10px",
            margin: "5px 0",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            border: "1px solid grey", // Grey border
            width: "227px",
            marginLeft: "20px",
            padding: "10px",
          }
        : {},
    },
    {
      key: "2",
      icon: <AppstoreOutlined style={iconStyle} />,
      label: (
        <Link
          onClick={() => {
            setCollapsed(false);
          }}
          to="/estimation-summary"
          style={{ color: "#fff" }}
        >
          Estimation Summary
        </Link>
      ),
      style: !collapsed
        ? {
            backgroundColor: "#52BD91", // Light green background for Dashboard
            borderRadius: "10px",
            margin: "5px 0",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            border: "1px solid grey", // Grey border
            width: "227px",
            marginLeft: "20px",
            padding: "10px",
          }
        : {},
    },
    {
      key: "3",
      icon: <FileDoneOutlined style={iconStyle} />,
      label: (
        <Link
          onClick={() => {
            setCollapsed(false);
          }}
          to="/estimation-details"
          style={{ color: "#fff" }}
        >
          Estimation Details
        </Link>
      ),
      style: !collapsed
        ? {
            backgroundColor: "#52BD91", // Light green background for Dashboard
            borderRadius: "10px",
            margin: "5px 0",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            border: "1px solid grey", // Grey border
            width: "227px",
            marginLeft: "20px",
            padding: "10px",
          }
        : {},
    },
    {
      key: "4",
      icon: <LogoutOutlined style={iconStyle} />,
      label: (
        <Link
          onClick={() => {
            setCollapsed(false);
            handleLogOut();
          }}
          to="/"
          style={{ color: "#fff" }}
        >
          Logout
        </Link>
      ),
      style: !collapsed
        ? {
            backgroundColor: "#52BD91", // Light green background for Dashboard
            borderRadius: "10px",
            margin: "5px 0",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            border: "1px solid grey", // Grey border
            width: "227px",
            marginLeft: "20px",
            padding: "10px",
          }
        : {},
    },
    // {
    //   key: "2",
    //   icon: <AppstoreOutlined style={iconStyle} />,
    //   label: <span style={{ color: "#fff" }}>Masters</span>,
    //   children: [
    //     {
    //       key: "2-1",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Area Master
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "2-2",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Stock Master
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "2-3",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Product Master
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "2-4",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Counter Master
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "2-5",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Stone Item
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "2-6",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Stone Rate Fix
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "2-7",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Main Item
    //         </Link>
    //       ),
    //     },
    //   ],
    // },
    // {
    //   key: "3",
    //   icon: <FileDoneOutlined style={iconStyle} />,
    //   label: <span style={{ color: "#fff" }}>Inventory</span>,
    //   children: [
    //     {
    //       key: "3-1",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Lot Creation
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "3-2",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Tag Generation
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "3-3",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Tag Edit
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "3-4",
    //       label: (
    //         <span style={{ color: "#fff" }}>
    //           Reports
    //           <Popover
    //             content={
    //               <Menu>
    //                 <Menu.Item
    //                   key="3-4-1"
    //                   style={{ backgroundColor: "#555E9F", width: "190px" }}
    //                 >
    //                   <Link
    //                     onClick={() => {
    //                       setCollapsed(false);
    //                     }}
    //                     style={{ color: "#fff" }}
    //                   >
    //                     Tag Stock Summary
    //                   </Link>
    //                 </Menu.Item>
    //                 <Menu.Item
    //                   key="3-4-2"
    //                   style={{ backgroundColor: "#555E9F", width: "190px" }}
    //                 >
    //                   <Link
    //                     onClick={() => {
    //                       setCollapsed(false);
    //                     }}
    //                     style={{ color: "#fff" }}
    //                   >
    //                     Tag Stock Details
    //                   </Link>
    //                 </Menu.Item>
    //                 <Menu.Item
    //                   key="3-4-3"
    //                   style={{ backgroundColor: "#555E9F", width: "190px" }}
    //                 >
    //                   <Link
    //                     onClick={() => {
    //                       setCollapsed(false);
    //                     }}
    //                     style={{ color: "#fff" }}
    //                   >
    //                     Slip Summary
    //                   </Link>
    //                 </Menu.Item>
    //               </Menu>
    //             }
    //             trigger={collapsed ? "hover" : "click"} // Show popover on hover when collapsed, click otherwise
    //             placement="right" // Change the direction of the popover
    //             overlayStyle={{ width: "220px" }} // Increase the width of the popover
    //           >
    //             <RightCircleFilled
    //               style={{ marginLeft: "117px", color: "#fff" }}
    //             />
    //           </Popover>
    //         </span>
    //       ),
    //     },
    //     {
    //       key: "3-5",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Elimination
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "3-6",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Recycle Bin
    //         </Link>
    //       ),
    //     },
    //   ],
    // },
    // {
    //   key: "4",
    //   icon: <ShopOutlined style={iconStyle} />,
    //   label: <span style={{ color: "#fff" }}>Point of Sale</span>,
    //   children: [
    //     {
    //       key: "4-1",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           to="/estimations"
    //           style={{ color: "#fff" }}
    //         >
    //           Estimation
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "4-2",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           to="/estimation-summary"
    //           style={{ color: "#fff" }}
    //         >
    //           Estimation Summary
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "4-3",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           to="/estimation-details"
    //           style={{ color: "#fff" }}
    //         >
    //           Estimation Details
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "4-4",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Sale Inovice
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "4-5",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Sale Return
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "4-6",
    //       label: (
    //         <span style={{ color: "#fff" }}>
    //           Reports
    //           <Popover
    //             content={
    //               <Menu>
    //                 <Menu.Item
    //                   key="4-5-1"
    //                   style={{ backgroundColor: "#555E9F", width: "190px" }}
    //                 >
    //                   <Link
    //                     onClick={() => {
    //                       setCollapsed(false);
    //                     }}
    //                     style={{ color: "#fff" }}
    //                   >
    //                     Estimation Summary
    //                   </Link>
    //                 </Menu.Item>
    //                 <Menu.Item
    //                   key="4-5-2"
    //                   style={{ backgroundColor: "#555E9F", width: "190px" }}
    //                 >
    //                   <Link
    //                     onClick={() => {
    //                       setCollapsed(false);
    //                     }}
    //                     style={{ color: "#fff" }}
    //                   >
    //                     Estimation Detail
    //                   </Link>
    //                 </Menu.Item>
    //                 <Menu.Item
    //                   key="4-5-3"
    //                   style={{ backgroundColor: "#555E9F", width: "190px" }}
    //                 >
    //                   <Link
    //                     onClick={() => {
    //                       setCollapsed(false);
    //                     }}
    //                     style={{ color: "#fff" }}
    //                   >
    //                     Sale Summary
    //                   </Link>
    //                 </Menu.Item>
    //                 <Menu.Item
    //                   key="4-5-4"
    //                   style={{ backgroundColor: "#555E9F", width: "190px" }}
    //                 >
    //                   <Link
    //                     onClick={() => {
    //                       setCollapsed(false);
    //                     }}
    //                     style={{ color: "#fff" }}
    //                   >
    //                     Sale Register
    //                   </Link>
    //                 </Menu.Item>
    //                 <Menu.Item
    //                   key="4-5-5"
    //                   style={{ backgroundColor: "#555E9F", width: "190px" }}
    //                 >
    //                   <Link
    //                     onClick={() => {
    //                       setCollapsed(false);
    //                     }}
    //                     style={{ color: "#fff" }}
    //                   >
    //                     Sale Return Register
    //                   </Link>
    //                 </Menu.Item>
    //                 <Menu.Item
    //                   key="4-5-6"
    //                   style={{ backgroundColor: "#555E9F", width: "190px" }}
    //                 >
    //                   <Link
    //                     onClick={() => {
    //                       setCollapsed(false);
    //                     }}
    //                     style={{ color: "#fff" }}
    //                   >
    //                     Item Wise Sale Register
    //                   </Link>
    //                 </Menu.Item>
    //               </Menu>
    //             }
    //             trigger={collapsed ? "hover" : "click"} // Show popover on hover when collapsed, click otherwise
    //             placement="right" // Change the direction of the popover
    //             overlayStyle={{ width: "220px" }} // Increase the width of the popover
    //           >
    //             <RightCircleFilled
    //               style={{ marginLeft: "117px", color: "#fff" }}
    //             />
    //           </Popover>
    //         </span>
    //       ),
    //     },
    //   ],
    // },
    // {
    //   key: "5",
    //   icon: <DollarOutlined style={iconStyle} />,
    //   label: <span style={{ color: "#fff" }}>Accounts</span>,
    //   children: [
    //     {
    //       key: "5-1",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Voucher Entry
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "5-2",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Journal Entry
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "5-3",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Day Balance
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "5-4",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Cask Book
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "5-5",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Stock Book
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "5-6",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Bullion Book
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "5-7",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Day Transactions
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "5-8",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Dealer Ledger
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "5-9",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Dealer Out Standings
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "5-10",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Customer Ledger
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "5-11",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Customer Out Standings
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "5-12",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Journal Entry Register
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "5-13",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Journal Ledger
    //         </Link>
    //       ),
    //     },
    //   ],
    // },
    // {
    //   key: "6",
    //   icon: <TeamOutlined style={iconStyle} />,
    //   label: <span style={{ color: "#fff" }}>Purchase</span>,
    //   children: [
    //     {
    //       key: "6-1",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           ornaments Purchase
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "6-2",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Purchase Return
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "6-3",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Bullion Purchase
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "6-4",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Stone Purchase
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "6-5",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Stone Purchase Return
    //         </Link>
    //       ),
    //     },
    //   ],
    // },
    // {
    //   key: "7",
    //   icon: <LineChartOutlined style={iconStyle} />,
    //   label: <span style={{ color: "#fff" }}>Gold Smith</span>,
    //   children: [
    //     {
    //       key: "7-1",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Worker Book
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "7-2",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Issue Register
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "7-3",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Return Register
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "7-4",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Worker Transaction
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "7-5",
    //       label: (
    //         <Link
    //           onClick={() => {
    //             setCollapsed(false);
    //           }}
    //           style={{ color: "#fff" }}
    //         >
    //           Slip Wise Stone Summary
    //         </Link>
    //       ),
    //     },
    //   ],
    // },
  ];

  return (
    <div
      style={{
        // position: "relative",
        height: "100vh",
        backgroundColor: "lightgreen",
      }}
    >
      {/* Logo */}
      {/* {!collapsed && (
        <div
          style={{
            textAlign: "center",
            padding: "5px 0",
            backgroundColor: "#11083E",
          }}
        >
          <img src={logo} alt="Logo" style={{ width: "70%", height: "auto" }} />
        </div>
      )} */}

      <Menu
        mode="inline"
        theme="dark"
        style={{
          height: "calc(100vh)", // Leaves space for the sticky logo
          overflow: "hidden",
          backgroundColor: "#11083E", // Set the background color
          transition: "all 0.2s ease-in-out", // Add transition for quick expansion
        }}
        onClick={handleMenuClick} // Handle click event to select items
        selectedKeys={[selectedKey]} // Apply selected key for highlighting
        openKeys={openKeys} // Open submenu based on open keys
        onOpenChange={handleSubMenuOpenChange} // Handle submenu open state
      >
        {menuItems.map((menuItem) => {
          if (menuItem.children) {
            return (
              <Menu.SubMenu
                key={menuItem.key}
                icon={menuItem.icon}
                title={menuItem.label}
                style={{
                  maxHeight: "calc(100vh - 150px)", // Adjust height for submenu scroll
                  overflow: "hidden",
                }}
              >
                {/* Submenu Items */}
                <div
                  style={{
                    maxHeight: "300px", // Set a fixed height for scrolling
                    overflowY: "auto", // Enable vertical scrolling
                    scrollbarWidth: "thin", // Make scrollbar thin (for Firefox)
                    scrollbarColor: "rgba(255, 255, 255, 0.2) transparent", // Light scrollbar color
                  }}
                >
                  {/* Webkit scrollbar styling */}
                  {menuItem.children.map((submenu, index) => (
                    <React.Fragment key={submenu.key}>
                      <Menu.Item
                        key={submenu.key}
                        style={{
                          backgroundColor:
                            selectedKey === submenu.key
                              ? "#aed2f385"
                              : "transparent", // Highlight selected submenu item
                          borderRadius:
                            selectedKey === submenu.key ? "10px" : "0px", // Rounded corners for selected item
                          position: "relative", // For positioning pseudo-element
                        }}
                      >
                        <span style={{ marginRight: "10px", color: "#fff" }}>
                          <AppstoreOutlined />
                        </span>
                        {submenu.label}
                        {selectedKey === submenu.key && (
                          <div
                            style={{
                              content: '""',
                              position: "absolute",
                              top: "-10px",
                              left: "-10px",
                              right: "-10px",
                              bottom: "-10px",
                              background: "rgba(173, 216, 230, 0.3)", // Light blue background for shape
                              borderRadius: "10px", // Rounded corners for the shape
                              zIndex: "-1", // Behind the text
                            }}
                          />
                        )}
                      </Menu.Item>
                      {index < menuItem.children.length - 1 && (
                        <Divider
                          style={{
                            backgroundColor: "rgb(163 159 159)",
                            padding: "0px",
                            margin: "0px",
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </Menu.SubMenu>
            );
          } else {
            return (
              <Menu.Item
                key={menuItem.key}
                icon={menuItem.icon}
                style={{
                  position: "relative", // Ensure the pseudo-element is positioned correctly
                  backgroundColor:
                    selectedKey === menuItem.key ? "#aed2f385" : "transparent", // Highlight when selected
                  margin: "5px 0", // Add margin for small card effect
                  border: "1px solid grey", // Grey border for menu item
                  ...menuItem.style, // Apply specific style for Dashboard
                }}
              >
                {menuItem.label}
                {selectedKey === menuItem.key && (
                  <div
                    style={{
                      content: '""',
                      position: "absolute",
                      top: "-10px",
                      left: "-10px",
                      right: "-10px",
                      bottom: "-10px",
                      background: "rgba(173, 216, 230, 0.3)", // Light blue background for shape
                      borderRadius: "10px", // Rounded corners for the shape
                      zIndex: "-1", // Behind the text
                    }}
                  />
                )}
              </Menu.Item>
            );
          }
        })}
      </Menu>
    </div>
  );
};

export default Sidebar;
