import React, { useState } from "react";

import { Input, Button, message } from "antd";

import {

  MailOutlined,

  LockOutlined

} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import axiosInstance from "../utils/axiosInstance";

import "../styles/login.css";

function UserLogin() {

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

        formData

      );

      console.log(response.data);

      const loginData =
            response.data.data;

      const userData =
            loginData.user;

      localStorage.setItem(

        "token",

        loginData.token

      );

      localStorage.setItem(

        "user",

        JSON.stringify({

          userId:
              userData.userId,

          name:
              userData.name,

          email:
              userData.email,

          role:
              userData.role,

          contactNumber:
              userData.contactNumber,

          address:
              userData.address,

        })

      );

      message.success(
        "Login Successful"
      );

      window.location.href = "/";

    }

    catch (error) {

      console.log(error.response);

      message.error(

        error.response?.data?.message

        ||

        "Login Failed"

      );

    }

  };

  return (

    <div className="auth-page">

      <div className="login-container">

        <h1>User Login</h1>

        <p>
          Login to continue ordering
        </p>

        <div className="auth-form">

          <Input

            size="large"

            name="email"

            prefix={<MailOutlined />}

            placeholder="Email"

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

            className="auth-btn"

            onClick={handleLogin}

          >

            Login

          </Button>

          <div

            className="back-login"

            onClick={() =>
              navigate("/signup/user")
            }

          >

            Don't have an account?
            Sign Up

          </div>

        </div>

      </div>

    </div>

  );

}

export default UserLogin;