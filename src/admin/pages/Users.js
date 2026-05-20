import React, { useState, useEffect } from "react";

import {
  Card,
  Button,
  Row,
  Col,
  Avatar,
  Tag,
  Input,
  Select,
  Table,
  Space,
  Modal,
  message
} from "antd";

import {
  UserOutlined,
  CheckCircleOutlined,
  StopOutlined,
  SearchOutlined,
  PlusOutlined
} from "@ant-design/icons";

import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/Adminnavbar";

import "../styles/Users.css";

const { Option } = Select;

function Users() {

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [openModal, setOpenModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");

  const [users, setUsers] = useState([]);

  useEffect(() => {

    fetchUsers();

  }, []);



  const fetchUsers = async () => {

    try {

      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

      const response = await fetch(
        "http://localhost:8080/users/getallusers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("STATUS:", response.status);

      const data = await response.json();

      console.log("FULL API RESPONSE:", data);

      let usersArray = [];


      if (Array.isArray(data)) {

        usersArray = data;

      } else if (Array.isArray(data.data)) {

        usersArray = data.data;

      } else {

        console.log("INVALID RESPONSE FORMAT");

        message.error("Invalid Backend Response");

        return;
      }

      console.log("USERS ARRAY:", usersArray);

      const formattedUsers = usersArray.map((user) => ({
        key: user.userId,
        name: user.name || "No Name",
        email: user.email || "No Email",
        contact: user.contactNumber || "No Contact",
        address: user.address || "No Address",
        gender: user.gender || "Not Specified",
        status: "Active"
      }));

      console.log("FORMATTED USERS:", formattedUsers);

      setUsers(formattedUsers);

    } catch (error) {

      console.log("FETCH ERROR:", error);

      message.error("Failed To Fetch Users");
    }
  };



  const addUser = async () => {

    if (name === "" || email === "" || contact === "") {

      message.error("Please Fill All Fields");

      return;
    }

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/users/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            name,
            email,
            address,
            contactNumber: contact,
            password: "123456",
            role: "USER"
          })
        }
      );

      const data = await response.json();

      console.log("ADD USER RESPONSE:", data);

      if (data.success || response.ok) {

        message.success("User Added Successfully");

        fetchUsers();

        setName("");
        setEmail("");
        setContact("");
        setAddress("");

        setOpenModal(false);

      } else {

        message.error(data.message || "Failed To Add User");
      }

    } catch (error) {

      console.log(error);

      message.error("Something Went Wrong");
    }
  };


  const deleteUser = async (id) => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/users/deleteuser/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log("DELETE RESPONSE:", data);

      if (data.success || response.ok) {

        message.success("User Deleted");

        fetchUsers();

      } else {

        message.error("Delete Failed");
      }

    } catch (error) {

      console.log(error);

      message.error("Delete Failed");
    }
  };

  

  const toggleUserStatus = (key) => {

    const updatedUsers = users.map((user) => {

      if (user.key === key) {

        return {
          ...user,
          status:
            user.status === "Active"
              ? "Blocked"
              : "Active"
        };
      }

      return user;
    });

    setUsers(updatedUsers);
  };



  const filteredUsers = users.filter((user) => {

    const matchesSearch =
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : user.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });



  const columns = [

    {
      title: "USER",
      dataIndex: "name",

      render: (text) => (

        <Space>

          <Avatar
            style={{
              background: "#ff6b00"
            }}
          >
            {text[0]}
          </Avatar>

          {text}

        </Space>
      )
    },

    {
      title: "EMAIL",
      dataIndex: "email"
    },

    {
      title: "CONTACT",
      dataIndex: "contact"
    },

    {
      title: "STATUS",
      dataIndex: "status",

      render: (status) => (

        <Tag
          color={
            status === "Active"
              ? "green"
              : "red"
          }
        >
          {status}
        </Tag>
      )
    },

    {
      title: "ACTION",

      render: (_, record) => (

        <Space>

          <Button
            size="small"
            onClick={() =>
              toggleUserStatus(record.key)
            }
          >
            {
              record.status === "Active"
                ? "Block"
                : "Unblock"
            }
          </Button>

          <Button
            danger
            size="small"
            onClick={() =>
              deleteUser(record.key)
            }
          >
            Delete
          </Button>

        </Space>
      )
    }
  ];

  return (

    <div className="users-page-container">

      <Sidebar />

      <div className="users-main-content">

        <AdminNavbar />

        <div className="users-content-wrapper">

   

          <div className="users-header-section">

            <div>

              <p className="manage-text">
                MANAGE
              </p>

              <h1 className="users-main-title">
                USERS
              </h1>

              <p className="users-subtitle">
                View, block or manage user accounts
              </p>

            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="add-user-btn"
              onClick={() => setOpenModal(true)}
            >
              Add User
            </Button>

          </div>

        

          <Row gutter={20} className="users-stats-row">

            <Col span={8}>

              <Card className="users-stat-card blue-card">

                <Avatar
                  size={55}
                  className="stat-avatar blue-avatar"
                  icon={<UserOutlined />}
                />

                <h1>{users.length}</h1>

                <p>Total Registered</p>

              </Card>

            </Col>

            <Col span={8}>

              <Card className="users-stat-card green-card">

                <Avatar
                  size={55}
                  className="stat-avatar green-avatar"
                  icon={<CheckCircleOutlined />}
                />

                <h1>
                  {
                    users.filter(
                      (u) => u.status === "Active"
                    ).length
                  }
                </h1>

                <p>Active Users</p>

              </Card>

            </Col>

            <Col span={8}>

              <Card className="users-stat-card red-card">

                <Avatar
                  size={55}
                  className="stat-avatar red-avatar"
                  icon={<StopOutlined />}
                />

                <h1>
                  {
                    users.filter(
                      (u) => u.status === "Blocked"
                    ).length
                  }
                </h1>

                <p>Blocked Users</p>

              </Card>

            </Col>

          </Row>


          <div className="filter-section">

            <Input
              size="large"
              placeholder="Search by name or email"
              prefix={<SearchOutlined />}
              className="search-input"
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
            />

            <Select
              value={statusFilter}
              size="large"
              className="filter-dropdown"
              onChange={(value) =>
                setStatusFilter(value)
              }
            >
              <Option value="all">
                All Users
              </Option>

              <Option value="active">
                Active
              </Option>

              <Option value="blocked">
                Blocked
              </Option>

            </Select>

          </div>

   

          <Card className="users-table-card">

            <div className="table-header">

              <h2>
                User Records
              </h2>

            </div>

            <Table
              columns={columns}
              dataSource={filteredUsers}
              pagination={{
                pageSize: 5
              }}
            />

          </Card>

   

          <Modal
            open={openModal}
            onCancel={() =>
              setOpenModal(false)
            }
            footer={null}
            title="Add User"
          >

            <Input
              placeholder="Name"
              className="modal-input"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <Input
              placeholder="Email"
              className="modal-input"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <Input
              placeholder="Contact"
              className="modal-input"
              value={contact}
              onChange={(e) =>
                setContact(e.target.value)
              }
            />

            <Input
              placeholder="Address"
              className="modal-input"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
            />

            <Button
              type="primary"
              block
              className="submit-btn"
              onClick={addUser}
            >
              Add User
            </Button>

          </Modal>

        </div>

      </div>

    </div>
  );
}

export default Users;