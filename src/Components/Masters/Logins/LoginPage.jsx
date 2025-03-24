import React, { useEffect } from "react";
import { Card, Button, Form, Input, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../../../Components/Assets/textLogo.png";
import { CREATE_jwel } from "../../../Config/Config";
import styles from "./Login.module.css";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/estimations"); // Redirect to estimations if already logged in
    }
  }, [navigate]);

  const onFinish = async (values) => {
    const { username, password } = values;
    try {
      const response = await fetch(
        `${CREATE_jwel}/api/Tenant/CheckValidTenantWithName?userName=${username}&password=${password}&clientName=MADHU`
      );
      const data = await response.json();
      if (data?.tenantName) {
        localStorage.setItem("isLoggedIn", "true"); // Store login status
        onLogin();
        navigate("/estimations");
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
    <div className={styles.loginPageContainer}
    style={{
        backgroundImage: "url('https://img.freepik.com/free-vector/abstract-dark-blue-vector-futuristic-digital-grid-background_53876-110562.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }}
    >
      {" "}
      <div className={styles.loginWrapper}>
        {" "}
        <div className={styles.welcomeSection}>
          {" "}

          <div className={styles.welcomeContent}>
            {" "}
    
            <img src={logo} alt="Logo" className={styles.logo} />{" "}
    
          </div>
        </div>
        <div className={styles.loginSection}>
          {" "}

          <Card bordered={false} className={styles.loginCard}>
            {" "}
    
            <h2 style={{ textAlign: "center", marginBottom: "5px", fontSize: "24px", fontWeight: "bold" }}>Login</h2>
            <p style={{ textAlign: "center",fontSize: "16px", }}>Log in to your account to continue</p>
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input size="large" placeholder="Username" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password size="large" placeholder="Password" />
              </Form.Item>
              <Form.Item className={styles.rememberForgot}>
                {" "}
        
                <Checkbox>Remember me</Checkbox>
                <a href="/" className={styles.forgotPassword}>
                  {" "}
        
                  Forgot password?
                </a>
              </Form.Item>
              <Form.Item style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.loginButton}
                  size="large"
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
