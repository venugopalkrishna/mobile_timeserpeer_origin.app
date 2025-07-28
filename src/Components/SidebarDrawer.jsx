import { AppstoreOutlined, FileDoneOutlined, HomeOutlined } from "@ant-design/icons";
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
import React from "react";
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

  const logOut = () => {
    navigate("/");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("images");
    localStorage.removeItem("city");
    localStorage.removeItem("singleImage");
    localStorage.removeItem("tenantName");
    window.location.reload();
  };

  const menuItems = [
    { text: "Estimation", icon: <HomeOutlined />, path: "/estimations" },
    { text: "Estimation Details", icon: <AppstoreOutlined />, path: "/estimation-details" },
    { text: "Estimation Summary", icon: <FileDoneOutlined />, path: "/estimation-summary" },
    // { text: "Inventory", icon: <Inventory />, path: "/inventory" },
    // { text: "Accounts", icon: <People />, path: "/accounts" },
    // { text: "Saving Scheme", icon: <ShoppingCart />, path: "/purchase-plans" },
    // { text: "CRM", icon: <Business />, path: "/crm" },
    // { text: "Graphs", icon: <BarChart />, path: "/graphs" },
    // {
    //   text: "Tag Check",
    //   icon: <QrCode2OutlinedIcon />,
    //   path: "/bar-code-check",
    // },
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          width: 270,
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
              border: "2px solid #52bd91"
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

      <List>
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
