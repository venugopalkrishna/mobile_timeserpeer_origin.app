import {
  AppstoreOutlined,
  FileDoneOutlined,
  HomeOutlined,
  LeftSquareOutlined,
  ShopOutlined,
  BgColorsOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import LabelIcon from "@mui/icons-material/Label";
import LabelOffIcon from "@mui/icons-material/LabelOff";
import DetailsIcon from "@mui/icons-material/Details";
import SummarizeIcon from "@mui/icons-material/Summarize";
import SellIcon from "@mui/icons-material/Sell";
import StyleIcon from "@mui/icons-material/Style";
import ReceiptIcon from "@mui/icons-material/Receipt";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SidebarDrawer = ({
  open,
  toggleDrawer,
  singleImage,
  userArea,
  userName,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState(null);
  const userType = localStorage.getItem("userType");

  const logOut = () => {
    navigate("/");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("images");
    localStorage.removeItem("city");
    localStorage.removeItem("singleImage");
    localStorage.removeItem("tenantName");
    localStorage.removeItem("userType");
    localStorage.clear();
    window.location.reload();
  };

  let menuItems = [];

  const estimationMenu = {
    text: "Estimation",
    icon: <ShopOutlined />,
    children: [
      {
        text: "Estimation With Stones",
        path: "/estimations-model1",
        icon: <LabelIcon sx={{ width: "1rem" }} />,
      },
      {
        text: "Estimation With Out Stones",
        path: "/estimations-model2",
        icon: <LabelOffIcon sx={{ width: "1rem" }} />,
      },
      {
        text: "Estimation Details",
        icon: <DetailsIcon sx={{ width: "1rem" }} />,
        path: "/estimation-details",
      },
      {
        text: "Estimation Summary",
        icon: <SummarizeIcon sx={{ width: "1rem" }} />,
        path: "/estimation-summary",
      },
    ],
  };

  const returnEstimationMenu = {
    text: "Return Estimation",
    icon: <LeftSquareOutlined />,
    children: [
      {
        text: "Return Estimation With Stones",
        path: "/return-estimations-model1",
        icon: <LabelIcon sx={{ width: "1rem" }} />,
      },
      {
        text: "Return Estimation With Out Stones",
        path: "/return-estimations-model2",
        icon: <LabelOffIcon sx={{ width: "1rem" }} />,
      },
      {
        text: "Return Estimation Details",
        icon: <DetailsIcon sx={{ width: "1rem" }} />,
        path: "/return-estimation-details",
      },
      {
        text: "Return Estimation Summary",
        icon: <SummarizeIcon sx={{ width: "1rem" }} />,
        path: "/return-estimation-summary",
      },
    ],
  };

  const inventoryMenu = {
    text: "Inventory",
    icon: <FileDoneOutlined />,
    children: [
      {
        text: "Tag Details",
        path: "/tag-details",
        icon: <SellIcon sx={{ width: "1rem" }} />,
      },
      {
        text: "Tag Stock Summary",
        path: "/tag-stock-summary",
        icon: <StyleIcon sx={{ width: "1rem" }} />,
      },
      {
        text: "Slip Summary",
        icon: <SummarizeIcon sx={{ width: "1rem" }} />,
        path: "/slip-summary",
      },
      {
        text: "Tag Check",
        path: "/tag-check",
        icon: <StyleIcon sx={{ width: "1rem" }} />,
      },
    ],
  };

  const saleMenu = {
    text: "Sale",
    icon: <ReceiptIcon />,
    path: "/sale",
  };

  const saleReturnMenu = {
    text: "Sale Return",
    icon: <ReceiptIcon />,
    path: "/sale-return",
  };

  const VoucherMenu = {
    text: "Smith Transaction",
    icon: <BgColorsOutlined />,
    children: [
      {
        text: "Voucher",
        path: "/voucher",
        icon: <WalletOutlined sx={{ width: "1rem" }} />,
      },
    ],
  };

  if (Number(userType) === 1) {
    menuItems = [estimationMenu, returnEstimationMenu];
  } else if (Number(userType) === 2) {
    menuItems = [
      estimationMenu,
      returnEstimationMenu,
      saleMenu,
      saleReturnMenu,
    ];
  } else {
    menuItems = [
      estimationMenu,
      returnEstimationMenu,
      inventoryMenu,
      saleMenu,
      saleReturnMenu,
    ];
  }
  // const menuItems = [
  //   {
  //     text: "Estimation",
  //     icon: <ShopOutlined />,
  //     children: [
  //       {
  //         text: "Estimation With Stones",
  //         path: "/estimations-model1",
  //         icon: <LabelIcon sx={{ width: "1rem" }} />,
  //       },
  //       {
  //         text: "Estimation With Out Stones",
  //         path: "/estimations-model2",
  //         icon: <LabelOffIcon sx={{ width: "1rem" }} />,
  //       },
  //       {
  //         text: "Estimation Details",
  //         icon: <DetailsIcon sx={{ width: "1rem" }} />,
  //         path: "/estimation-details",
  //       },
  //       {
  //         text: "Estimation Summary",
  //         icon: <SummarizeIcon sx={{ width: "1rem" }} />,
  //         path: "/estimation-summary",
  //       },
  //     ],
  //   },
  //   {
  //     text: "Return Estimation",
  //     icon: <LeftSquareOutlined />,
  //     children: [
  //       {
  //         text: "Return Estimation With Stones",
  //         path: "/return-estimations-model1",
  //         icon: <LabelIcon sx={{ width: "1rem" }} />,
  //       },
  //       {
  //         text: "Return Estimation With Out Stones",
  //         path: "/return-estimations-model2",
  //         icon: <LabelOffIcon sx={{ width: "1rem" }} />,
  //       },
  //       {
  //         text: "Return Estimation Details",
  //         icon: <DetailsIcon sx={{ width: "1rem" }} />,
  //         path: "/return-estimation-details",
  //       },
  //       {
  //         text: "Return Estimation Summary",
  //         icon: <SummarizeIcon sx={{ width: "1rem" }} />,
  //         path: "/return-estimation-summary",
  //       },
  //     ],
  //   },
  //   {
  //     text: "Inventory",
  //     icon: <FileDoneOutlined />,
  //     children: [
  //       {
  //         text: "Tag Details",
  //         path: "/tag-details",
  //         icon: <SellIcon sx={{ width: "1rem" }} />,
  //       },
  //       {
  //         text: "Tag Stock Summary",
  //         path: "/tag-stock-summary",
  //         icon: <StyleIcon sx={{ width: "1rem" }} />,
  //       },
  //       {
  //         text: "Slip Summary",
  //         icon: <SummarizeIcon sx={{ width: "1rem" }} />,
  //         path: "/slip-summary",
  //       },
  //       {
  //         text: "Tag Check",
  //         path: "/tag-check",
  //         icon: <StyleIcon sx={{ width: "1rem" }} />,
  //       },
  //     ],
  //   },
  //   {
  //     text: "Sale",
  //     icon: <ReceiptIcon/>,
  //     path: "/sale",
  //   },
  // ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer}
      sx={{
        "& .MuiDrawer-paper": {
          width: 300,
          backgroundColor: "#203882",
          color: "white",
        },
      }}
    >
      <Box sx={{ backgroundColor: "#0c1439", height: "140px" }}>
        <Box display="flex" justifyContent="flex-end" mt={1} mb={1}>
          <IconButton onClick={toggleDrawer} sx={{ color: "red" }}>
            <CancelRoundedIcon style={{ fontSize: 32 }} />
          </IconButton>
        </Box>

        <Box display="flex" justifyContent="center" mt={-6} mb={1}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              backgroundColor: "black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "2px solid #52bd91",
            }}
          >
            <img
              src={singleImage}
              alt="img"
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" marginBottom="5px">
          <span
            style={{ fontWeight: "bold", color: "#52bd91", fontSize: "14px" }}
          >
            {userName}
          </span>
        </Box>
        <Box display="flex" justifyContent="center">
          <span
            style={{ fontWeight: "bold", color: "white", fontSize: "11px" }}
          >
            {userArea}
          </span>
        </Box>
      </Box>

      {/* <List>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <React.Fragment key={index}>
              <ListItem
                button
                onClick={() => {
                  navigate(item.path);
                  toggleDrawer();
                }}
                // sx={{
                //   backgroundColor: isActive ? "#52bd91" : "transparent",
                //   "&:hover": { backgroundColor: "#52bd91" },
                // }}
              >
                <ListItemIcon sx={{ color: isActive ? "#52bd91" : "white" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    color: isActive ? "#52bd91" : "white",
                  }}
                />
              </ListItem>
              <Divider
                sx={{
                  backgroundColor: "white",
                  opacity: 0.9,
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
              />
            </React.Fragment>
          );
        })}
      </List> */}

      <List>
        {menuItems.map((item, index) => {
          const hasChildren = Array.isArray(item.children);
          const isExpanded = expandedMenu === item.text;
          const isParentActive = hasChildren
            ? item.children.some((child) => location.pathname === child.path)
            : location.pathname === item.path;

          return (
            <React.Fragment key={index}>
              <ListItem
                button
                onClick={() => {
                  if (hasChildren) {
                    setExpandedMenu((prev) =>
                      prev === item.text ? null : item.text
                    );
                  } else {
                    navigate(item.path);
                    toggleDrawer();
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isParentActive ? "#52bd91" : "white",
                    fontSize: "22px",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    color: isParentActive ? "#52bd91" : "white",
                  }}
                />
              </ListItem>

              {/* Render children if expanded */}
              {hasChildren &&
                isExpanded &&
                item.children.map((subItem, subIndex) => {
                  const isActive = location.pathname === subItem.path;
                  return (
                    <ListItem
                      key={subIndex}
                      button
                      sx={{ pl: 4 }}
                      onClick={() => {
                        navigate(subItem.path);
                        toggleDrawer();
                        window.location.reload();
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: isActive ? "#52bd91" : "white",
                          width: "0.7rem",
                        }}
                      >
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={subItem.text}
                        primaryTypographyProps={{
                          fontWeight: "normal",
                          fontSize: "14px",
                          color: isActive ? "#52bd91" : "white",
                        }}
                      />
                    </ListItem>
                  );
                })}

              <Divider
                sx={{
                  backgroundColor: "white",
                  opacity: 0.9,
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
              />
            </React.Fragment>
          );
        })}
      </List>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#fff",
            color: "#52bd91",
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "3px 25px",
          }}
          onClick={logOut}
        >
          Logout
        </Button>
        <Typography variant="body2" sx={{ color: "white" }}>
          V 1.0
        </Typography>
      </Box>
    </Drawer>
  );
};

export default SidebarDrawer;
