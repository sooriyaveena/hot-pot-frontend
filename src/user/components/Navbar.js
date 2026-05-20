import React from "react";

import { Menu, Avatar, Button, Badge } from "antd";
import { useCart } from "../context/CartContext";
import {
  HomeOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { useNavigate, useLocation } from "react-router-dom";

import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,

    0,
  );
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin = user?.role === "ADMIN";

  const isUser = user?.role === "USER";

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/");

    window.location.reload();
  };

  const items = [
    {
      key: "/",

      icon: <HomeOutlined />,

      label: "Home",

      onClick: () => navigate("/"),
    },

    {
      key: "/restaurant",

      icon: <ShopOutlined />,

      label: "Restaurant",

      onClick: () => navigate("/restaurant"),
    },

    ...(isUser
      ? [
          {
            key: "/cart",

            icon: (
              <Badge count={cartCount} size="small">
                <ShoppingCartOutlined />
              </Badge>
            ),

            label: "Cart",

            onClick: () => navigate("/cart"),
          },

          {
            key: "/orders",

            icon: <FileTextOutlined />,

            label: "Orders",

            onClick: () => navigate("/orders"),
          },
        ]
      : []),

    ...(isAdmin
      ? [
          {
            key: "/admin",

            icon: <ShopOutlined />,

            label: "Dashboard",

            onClick: () => navigate("/admin"),
          },
        ]
      : []),
  ];

  return (
    <div className="navbar-container">
    

      <div className="logo-section" onClick={() => navigate("/")}>
        <div className="logo-icon">🍲</div>

        <h2>HotPot</h2>
      </div>

  

      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={items}
        className="nav-menu"
      />



      <div className="right-section">
        {!user ? (
          <Button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </Button>
        ) : (
          <>
            <div className="profile-box" onClick={() => navigate("/profile")}>
              <Avatar className="profile-avatar">
                {user?.email?.charAt(0)?.toUpperCase()}
              </Avatar>
            </div>

            <Button danger className="logout-btn" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
