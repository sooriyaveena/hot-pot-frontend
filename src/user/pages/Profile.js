import React, { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import axiosInstance from "../utils/axiosInstance";
import { Modal, Input, message } from "antd";
import {
  UserOutlined,
  EnvironmentOutlined,
  EditOutlined,
  HomeOutlined,
  SettingOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

import "../styles/profile.css";

function Profile() {
  const localUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);

  const [totalOrders, setTotalOrders] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editData, setEditData] = useState({
    name: "",

    email: "",

    contactNumber: "",

    address: "",
  });
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    if (!localUser?.userId) return;

  

    axiosInstance

      .get(`/users/getbyid/${localUser.userId}`)

      .then((res) => {
        setUser(res.data.data);
      })

      .catch((err) => {
        console.log(err);
      });

  

    axiosInstance

      .get(`/users/orders/count/${localUser.userId}`)
      .then((res) => {
        setTotalOrders(res.data.data);
      })

      .catch((err) => {
        console.log(err);
      });

    
    axiosInstance

      .get(`/users/spent/${localUser.userId}`)
      .then((res) => {
        setTotalSpent(res.data.data);
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);
  const saveProfile = async () => {
    try {
      const res = await axiosInstance.put(
        `/users/updateprofile/${user.userId}`,

        {
          name: editData.name,

          email: editData.email,

          contactNumber: editData.contactNumber,

          address: editData.address,
        },
      );

      setUser(res.data.data);

      localStorage.setItem(
        "user",

        JSON.stringify(res.data.data),
      );

      message.success("Profile updated successfully");

      setIsModalOpen(false);
    } catch (err) {
      console.log(err);

      message.error("Failed to update profile");
    }
  };
  if (!user) {
    return (
      <div>
        <Navbar />

        <h2
          style={{
            textAlign: "center",
            marginTop: "100px",
          }}
        >
          Loading Profile...
        </h2>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-wrapper">
        

        <div className="profile-banner">
          <div className="profile-left">
            <div className="profile-avatar">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <h1>{user?.name}</h1>

              <p>{user?.email}</p>

              <span>
                <EnvironmentOutlined />

                {user?.address || "Chennai"}
              </span>
            </div>
          </div>

          <button
            className="edit-btn"
            onClick={() => {
              setEditData({
                name: user.name,

                email: user.email,

                contactNumber: user.contactNumber,

                address: user.address,
              });

              setIsModalOpen(true);
            }}
          >
            <EditOutlined />
            Edit Profile
          </button>
        </div>

      

        <div className="profile-grid">
      

          <div className="profile-card">
            <h2>
              <UserOutlined />
              Personal Info
            </h2>

            <div className="info-row">
              <span>Full Name</span>

              <p>{user?.name}</p>
            </div>

            <div className="info-row">
              <span>Phone</span>

              <p>{user?.contactNumber}</p>
            </div>

            <div className="info-row">
              <span>Email</span>

              <p>{user?.email}</p>
            </div>

            <div className="info-row">
              <span>Role</span>

              <p>{user?.role}</p>
            </div>
          </div>

     

          <div className="profile-card">
            <h2>
              <HomeOutlined />
              Saved Address
            </h2>
            <div className="address-row">
              <div>
                <HomeOutlined />

                <span>Home</span>
              </div>

              <p>{user?.address}</p>
            </div>
            <button
              className="add-address-btn"
              onClick={() => {
                setEditData({
                  ...editData,

                  address: user.address || "",
                });

                setIsModalOpen(true);
              }}
            >
              Change Address
            </button>{" "}
          </div>


          <div className="profile-card">
            <h2>
              <BarChartOutlined />
              Order Stats
            </h2>

            <div className="info-row">
              <span>Total Orders</span>

              <p>{totalOrders}</p>
            </div>

            <div className="info-row">
              <span>Total Spent</span>

              <p className="green-text">₹{totalSpent}</p>
            </div>

            <div className="info-row">
              <span>User ID</span>

              <p>#{user?.userId}</p>
            </div>
          </div>

        

          <div className="profile-card">
            <h2>
              <SettingOutlined />
              Preferences
            </h2>

            <div className="info-row">
              <span>Dietary</span>

              <p>No Restrictions</p>
            </div>

            <div className="info-row">
              <span>Notifications</span>

              <p className="green-text">Enabled</p>
            </div>

            <div className="info-row">
              <span>Language</span>

              <p>English</p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={saveProfile}
        okText="Save Changes"
      >
        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          Edit Profile
        </h2>

        <Input
          placeholder="Name"
          value={editData.name}
          onChange={(e) =>
            setEditData({
              ...editData,

              name: e.target.value,
            })
          }
          style={{
            marginBottom: 15,
          }}
        />

        <Input
          placeholder="Email"
          value={editData.email}
          onChange={(e) =>
            setEditData({
              ...editData,

              email: e.target.value,
            })
          }
          style={{
            marginBottom: 15,
          }}
        />

        <Input
          placeholder="Phone"
          value={editData.contactNumber}
          onChange={(e) =>
            setEditData({
              ...editData,

              contactNumber: e.target.value,
            })
          }
          style={{
            marginBottom: 15,
          }}
        />

        <Input.TextArea
          rows={4}
          placeholder="Address"
          value={editData.address}
          onChange={(e) =>
            setEditData({
              ...editData,

              address: e.target.value,
            })
          }
        />
      </Modal>
    </div>
  );
}

export default Profile;
