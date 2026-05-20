import React, { useState } from "react";

import { Input, Button, message } from "antd";

import { MailOutlined, LockOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import axiosInstance from "../utils/axiosInstance";

import "../styles/login.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post(
        "/users/login",

        formData,
      );

      localStorage.setItem(
        "token",

        response.data.token,
      );

      localStorage.setItem(
        "user",

        JSON.stringify({
          email: formData.email,

          role: "ADMIN",
        }),
      );

      message.success("Admin Login Successful");

      navigate("/admin");
    } catch (error) {
      message.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="auth-page admin-page">
      <div className="login-container">
        <div className="auth-logo admin-logo">🛠</div>

        <h1 className="auth-title">Admin Login</h1>

        <p className="auth-subtitle">Manage restaurants, orders and menus</p>

        <div className="auth-form">
          <Input
            size="large"
            name="email"
            prefix={<MailOutlined />}
            placeholder="Admin Email"
            onChange={handleChange}
          />

          <Input.Password
            size="large"
            name="password"
            prefix={<LockOutlined />}
            placeholder="Password"
            onChange={handleChange}
          />

          <Button
            type="primary"
            size="large"
            className="admin-auth-btn"
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
