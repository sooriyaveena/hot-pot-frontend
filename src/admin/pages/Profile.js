import React, {
  useEffect,
  useState,
} from "react";

import {
  Input,
  Button,
  message,
  Spin,
} from "antd";

import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  EditOutlined,
  LockOutlined,
  SafetyOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

import Sidebar from "../components/Sidebar";

import AdminNavbar from "../components/Adminnavbar";

import "../styles/AdminProfile.css";

function Profile() {

  const storedUser =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};

  const token =
    localStorage.getItem("token");

  const userEmail =
    storedUser.email;

  const [loading, setLoading] =
    useState(true);

  const [adminData, setAdminData] =
    useState({

      id: "",

      name: "",

      email: "",

      phone: "",

      address: "",

      role: "",

      password: "",

      confirmPassword: "",

    });

  const [stats, setStats] =
    useState({

      totalUsers: 0,

      totalOrders: 0,

      totalRevenue: 0,

      totalRestaurants: 0,

    });

  useEffect(() => {

    if (!token) {

      message.error(
        "Please Login Again"
      );

      return;

    }

    if (!userEmail) {

      message.error(
        "User Email Not Found"
      );

      return;

    }

    loadAdminProfile();

    loadDashboardStats();

  }, []);

  const loadAdminProfile =
    async () => {

      try {

        setLoading(true);

        const response =
          await fetch(

            "http://localhost:8080/users/getallusers",

            {
              headers: {

                Authorization:
                  `Bearer ${token}`,

              },
            }
          );

        if (!response.ok) {

          throw new Error(
            "Failed To Load Users"
          );

        }

        const result =
          await response.json();

        console.log(
          "ALL USERS:",
          result
        );

        const users =
          result.data || result;

        const currentAdmin =
          users.find(

            (user) =>

              user.email ===
              userEmail

          );

        console.log(
          "CURRENT ADMIN:",
          currentAdmin
        );

        if (!currentAdmin) {

          throw new Error(
            "Admin Not Found"
          );

        }

        setAdminData({

          id:
            currentAdmin.userId ||
            currentAdmin.id ||
            "",

          name:
            currentAdmin.name ||
            "",

          email:
            currentAdmin.email ||
            "",

          phone:
            currentAdmin.contactNumber ||
            currentAdmin.phoneNumber ||
            "",

          address:
            currentAdmin.address ||
            "",

          role:
            currentAdmin.role ||
            "",

          password: "",

          confirmPassword: "",

        });

      }

      catch (err) {

        console.log(err);

        message.error(
          err.message
        );

      }

      finally {

        setLoading(false);

      }

    };

  const loadDashboardStats =
    async () => {

      try {

        const headers = {

          Authorization:
            `Bearer ${token}`,

        };

        const usersRes =
          await fetch(

            "http://localhost:8080/users/getallusers",

            { headers }

          );

        const ordersRes =
          await fetch(

            "http://localhost:8080/order/all",

            { headers }

          );

        const restaurantsRes =
          await fetch(

            "http://localhost:8080/restaurant/all",

            { headers }

          );

        let usersData = [];

        let ordersData = [];

        let restaurantsData = [];

        if (usersRes.ok) {

          const data =
            await usersRes.json();

          usersData =
            data.data || data;

        }

        if (ordersRes.ok) {

          const data =
            await ordersRes.json();

          ordersData =
            data.data || data;

        }

        if (restaurantsRes.ok) {

          const data =
            await restaurantsRes.json();

          restaurantsData =
            data.data || data;

        }

        const totalRevenue =
          ordersData.reduce(

            (sum, order) =>

              sum +
              (order.totalAmount || 0),

            0

          );

        setStats({

          totalUsers:
            usersData.length,

          totalOrders:
            ordersData.length,

          totalRevenue,

          totalRestaurants:
            restaurantsData.length,

        });

      }

      catch (err) {

        console.log(err);

      }

    };

  const handleChange = (e) => {

    const { name, value } =
      e.target;

    setAdminData({

      ...adminData,

      [name]: value,

    });

  };

  const handleSave =
    async () => {

      if (

        adminData.password &&

        adminData.password !==
          adminData.confirmPassword

      ) {

        message.error(
          "Passwords Do Not Match"
        );

        return;

      }

      try {

        const updatedUser = {

          name:
            adminData.name,

          email:
            adminData.email,

          contactNumber:
            adminData.phone,

          address:
            adminData.address,

        };

        const response =
          await fetch(

            `http://localhost:8080/users/update/${adminData.id}`,

            {

              method: "PUT",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,

              },

              body: JSON.stringify(
                updatedUser
              ),

            }
          );

        if (!response.ok) {

          throw new Error(
            "Update Failed"
          );

        }

        localStorage.setItem(

          "user",

          JSON.stringify({

            ...storedUser,

            ...updatedUser,

          })

        );

        message.success(
          "Profile Updated Successfully"
        );

      }

      catch (err) {

        console.log(err);

        message.error(
          err.message
        );

      }

    };

  if (loading) {

    return (

      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
        }}
      >

        <Spin size="large" />

      </div>

    );

  }

  return (

    <div className="admin-profile-page">

      <Sidebar />

      <div className="admin-profile-main">

        <AdminNavbar />

        <div className="admin-profile-wrapper">

          <div className="admin-profile-banner">

            <div className="admin-profile-left">

              <div className="admin-profile-avatar">

                <UserOutlined />

              </div>

              <div>

                <h1>

                  {adminData.name ||
                    "Admin"}

                </h1>

                <p>

                  {adminData.email ||
                    "No Email"}

                </p>

                <span>

                  <EnvironmentOutlined />

                  {" "}

                  {adminData.address ||
                    "No Address"}

                </span>

              </div>

            </div>

            <button className="admin-profile-edit-btn">

              <EditOutlined />

              Admin Profile

            </button>

          </div>

          <div className="admin-profile-grid">

            <div className="admin-profile-card">

              <h2>

                <UserOutlined />

                Personal Info

              </h2>

              <div className="admin-profile-input">

                <label>
                  Full Name
                </label>

                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  name="name"
                  value={
                    adminData.name
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="admin-profile-input">

                <label>
                  Email
                </label>

                <Input
                  size="large"
                  prefix={<MailOutlined />}
                  name="email"
                  value={
                    adminData.email
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="admin-profile-input">

                <label>
                  Phone
                </label>

                <Input
                  size="large"
                  prefix={<PhoneOutlined />}
                  name="phone"
                  value={
                    adminData.phone
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="admin-profile-input">

                <label>
                  Address
                </label>

                <Input
                  size="large"
                  prefix={
                    <EnvironmentOutlined />
                  }
                  name="address"
                  value={
                    adminData.address
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

            </div>

            <div className="admin-profile-card">

              <h2>

                <SafetyOutlined />

                Security

              </h2>

              <div className="admin-profile-input">

                <label>
                  Password
                </label>

                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  name="password"
                  value={
                    adminData.password
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="admin-profile-input">

                <label>
                  Confirm Password
                </label>

                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  name="confirmPassword"
                  value={
                    adminData.confirmPassword
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <Button
                className="admin-profile-btn"
                onClick={
                  handleSave
                }
              >

                Update Profile

              </Button>

            </div>

            <div className="admin-profile-card">

              <h2>

                <BarChartOutlined />

                Admin Stats

              </h2>

              <div className="admin-profile-stat">

                <span>
                  Total Users
                </span>

                <p>

                  {
                    stats.totalUsers
                  }

                </p>

              </div>

              <div className="admin-profile-stat">

                <span>
                  Total Orders
                </span>

                <p>

                  {
                    stats.totalOrders
                  }

                </p>

              </div>

              <div className="admin-profile-stat">

                <span>
                  Revenue Generated
                </span>

                <p className="green-text">

                  ₹
                  {
                    stats.totalRevenue
                  }

                </p>

              </div>

            </div>

            <div className="admin-profile-card">

              <h2>

                <BarChartOutlined />

                Admin Activity

              </h2>

              <div className="admin-profile-stat">

                <span>
                  Restaurants Managed
                </span>

                <p>

                  {
                    stats.totalRestaurants
                  }

                </p>

              </div>

              <div className="admin-profile-stat">

                <span>
                  Orders Reviewed
                </span>

                <p>

                  {
                    stats.totalOrders
                  }

                </p>

              </div>

              <div className="admin-profile-stat">

                <span>
                  System Status
                </span>

                <p className="green-text">

                  Active

                </p>

              </div>

              <Button
                className="admin-profile-btn"
                onClick={
                  loadDashboardStats
                }
              >

                Refresh Activity

              </Button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Profile;