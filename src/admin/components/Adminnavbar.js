import React, { useState } from "react";

import {
  Input,
  Badge,
  Avatar,
  Dropdown,
  Space,
  message
} from "antd";

import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  SettingOutlined
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import "../styles/Adminnavbar.css";

function Adminnavbar() {

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleMenuClick = ({ key }) => {

    if (key === "profile") {

      message.success("Opening Profile");

      navigate("/profile");
    }

    if (key === "settings") {

      message.success("Opening Settings");

      navigate("/settings");
    }

    if (key === "logout") {

      setIsLoggedIn(false);

      message.success("Logged Out");

      navigate("/login");
    }

    if (key === "login") {

      setIsLoggedIn(true);

      message.success("Logged In");

      navigate("/dashboard");
    }
  };

  const items = [

    {
      key: "profile",

      icon: <UserOutlined />,

      label: "Profile",
    },

    {
      key: "settings",

      icon: <SettingOutlined />,

      label: "Settings",
    },

    isLoggedIn
      ? {
          key: "logout",

          icon: <LogoutOutlined />,

          label: "Logout",
        }
      : {
          key: "login",

          icon: <LoginOutlined />,

          label: "Login",
        },
  ];

  return (

    <div className="admin-navbar-container">

      <div className="admin-left-section">

        <h2 className="admin-title">
          Admin Dashboard
        </h2>

      </div>

      <div className="admin-middle-section">

        <Input
          size="large"
          placeholder="Search here..."
          prefix={<SearchOutlined />}
          className="admin-search"
        />

      </div>

      <div className="admin-right-section">

        <Badge count={5} size="small">

          <div className="admin-notification-icon">

            <BellOutlined />

          </div>

        </Badge>

        <Dropdown
          menu={{
            items,
            onClick: handleMenuClick
          }}
          placement="bottomRight"
          trigger={["click"]}
        >

          <Space>

            <Avatar
              size={45}
              className="admin-avatar"
            >
              A
            </Avatar>

          </Space>

        </Dropdown>

      </div>

    </div>

  );
}

export default Adminnavbar;