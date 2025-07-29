import { Button, Form, Input } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CREATE_jwel } from "../../../Config/Config";
import mainLogo from "../../Assets/main-logo.jpg";
import timeseraLogo from "../../Assets/timesers-logo.png";
import logo from "../../Assets/tlogo.png";
import style from "./Login.module.css";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("tenantName")) {
      navigate("/estimations-model1");
    } else {
      navigate("/");
    }
  }, [navigate]);

  const userAPI = async (name) => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=FIRM_CONFIGURE`,
        {
          headers: {
            tenantName: name,
          },
        }
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const imageUrls = data[0]?.EPASS1.split(",");
        localStorage.setItem("images", imageUrls);
        localStorage.setItem("userName", data[0]?.FIRMNAME);
        localStorage.setItem("city", data[0]?.CITY);
        localStorage.setItem("singleImage", data[0]?.EPASS2);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const onFinish = async (values) => {
    const { username, password } = values;
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Tenant/CheckValidTenant?userName=${username}&password=${password}`
      );

      if (response?.data) {
        localStorage.setItem("isLoggedIn", "true"); // Store login status
        localStorage.setItem("tenantName", response?.data);
        onLogin(response?.data);
        userAPI(response?.data);
        navigate("/estimations-model1");
      } else {
        console.log("Invalid username or password");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={style.loginContainer}>
      <div className={style.backgroundImageContainer}>
        <img
          src={mainLogo}
          alt="Background"
          className={style.backgroundImage}
        />
        <div
          style={{
            zIndex: "999",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className={style.logoSection}>
            <img src={logo} alt="Logo" style={{ width: "35px" }} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <img
                src={timeseraLogo}
                alt="Text Logo"
                style={{ width: "150px" }}
              />
              <h3
                style={{
                  color: "rgb(176, 152, 64)",
                  fontSize: "10px",
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                Estimation APP
              </h3>
            </div>
          </div>
          <h3
            style={{
              color: "#0C1E48",
              fontSize: "14px",
              fontWeight: 700,
              display: "flex",
              justifyContent: "center",
            }}
          >
            Login to your account
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "80px",
            }}
          >
            <Form
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              initialValues={{ remember: true }}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please enter your username" },
                ]}
              >
                <Input
                  placeholder="Enter your username"
                  className={style.inputField}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  placeholder="Enter your password"
                  className={style.inputField1}
                />
              </Form.Item>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    // className={style.submitBtn}
                    style={{
                      backgroundColor: " #50bb8f",
                      color: "black",
                      border: "none",
                      borderRadius: "4px",
                      padding: "10px 20px",
                      fontSize: "16px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      // border: "2px solid #0C1E48",
                      height: "40px",
                      width: "100px",
                    }}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
