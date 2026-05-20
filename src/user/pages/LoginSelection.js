import React from "react";

import { useNavigate } from "react-router-dom";

import { UserOutlined, SettingOutlined } from "@ant-design/icons";

import "../styles/login.css";

function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="selection-container">
        <h1>Welcome to HotPot</h1>

        <p>Continue as User or Admin</p>

        <div className="selection-grid">
          <div
            className="selection-card"
            onClick={() => navigate("/login/user")}
          >
            <UserOutlined />

            <h2>User</h2>

            <span>Browse restaurants and order food</span>
          </div>

          <div
            className="selection-card admin-card"
            onClick={() => navigate("/login/admin")}
          >
            <SettingOutlined />

            <h2>Admin</h2>

            <span>Manage restaurants and menu</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSelection;
