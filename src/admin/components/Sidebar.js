import React from "react";

import { Menu } from "antd";

import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  UserOutlined,
  DollarOutlined,
  CreditCardOutlined,
  SettingOutlined,
  LogoutOutlined,
  ProfileOutlined
} from "@ant-design/icons";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

import "../styles/Sidebar.css";

function Sidebar() {

  const navigate = useNavigate();

  const location = useLocation();

  const selectedKey =
    location.pathname.split("/")[2] || "dashboard";

  return (

    <div className="sidebar-container">

      <div className="sidebar-logo-section">

        <div className="sidebar-logo-icon">
          🍲
        </div>

        <h2>
          HotPot
        </h2>

      </div>

      <div className="admin-badge">
        ADMIN PANEL
      </div>

      <Menu

        mode="inline"

        selectedKeys={[selectedKey]}

        className="sidebar-menu"

        items={[

          {
            key: "dashboard",

            icon: <DashboardOutlined />,

            label: "Dashboard",

            onClick: () => navigate("/admin/dashboard"),
          },

          {
            key: "categories",

            icon: <AppstoreOutlined />,

            label: "Categories",

            onClick: () => navigate("/admin/categories"),
          },

          {
            key: "restaurants",

            icon: <ShopOutlined />,

            label: "Restaurants",

            onClick: () => navigate("/admin/restaurants"),
          },

          {
            key: "menuitems",

            icon: <ShoppingCartOutlined />,

            label: "Menu Items",

            onClick: () => navigate("/admin/menuitems"),
          },

          {
            key: "orders",

            icon: <DollarOutlined />,

            label: "Orders",

            onClick: () => navigate("/admin/orders"),
          },

          {
            key: "deliveryperson",

            icon: <CreditCardOutlined />,

            label: "DeliveryPerson",

            onClick: () => navigate("/admin/deliveryperson"),
          },

          {
            key: "users",

            icon: <UserOutlined />,

            label: "Users",

            onClick: () => navigate("/admin/users"),
          },

          {
            key: "profile",

            icon: <ProfileOutlined/>,

            label: "Profile",

            onClick: () => navigate("/admin/profile"),
          },

          {
            key: "logout",

            icon: <LogoutOutlined />,

            label: "Logout",

            onClick: () => navigate("/login"),
          },

        ]}

      />

    </div>

  );
}

export default Sidebar;