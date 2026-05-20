import React, { useState } from "react";

import { message, Card, Input, Button } from "antd";

import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import axiosInstance from "../utils/axiosInstance";
import "../styles/login.css";

function UserSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async () => {
    try {
      await axiosInstance.post(
        "/users/register",

        formData,
      );
      message.success("Signup Successful");

      navigate("/login/user");
    } catch (error) {
      console.log(error.response);

      message.error(error.response?.data?.message || "Signup Failed");
    }
  };

  return (
    <div className="auth-page">
      <Card className="login-container">
        <div className="auth-logo">🍲</div>

        <h1 className="auth-title">Create Account</h1>

        <p className="auth-subtitle">Sign up to continue ordering</p>

        <div className="auth-form">
          <Input
            size="large"
            name="name"
            prefix={<UserOutlined />}
            placeholder="Full Name"
            onChange={handleChange}
          />

          <Input
            size="large"
            name="email"
            prefix={<MailOutlined />}
            placeholder="Email Address"
            onChange={handleChange}
          />
          <Input
            size="large"
            name="contactNumber"
            placeholder="Phone Number"
            onChange={handleChange}
          />
          <Input.TextArea
            rows={3}
            name="address"
            placeholder="Address"
            onChange={handleChange}
          />
          <Input.Password
            size="large"
            name="password"
            prefix={<LockOutlined />}
            placeholder="Password"
            onChange={handleChange}
          />

          <Button type="primary" className="auth-btn" onClick={handleSignup}>
            Create Account
          </Button>
        </div>

        <div className="back-login" onClick={() => navigate("/login/user")}>
          Already have an account? Login
        </div>
      </Card>
    </div>
  );
}

export default UserSignup;
