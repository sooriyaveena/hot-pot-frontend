import React, { useState, useEffect } from "react";

import {
  Card,
  Input,
  Button,
  Row,
  Col,
  Switch,
  Table,
  Tag,
  Space,
  Avatar,
  Select,
  Modal,
  message,
  Statistic
} from "antd";

import {
  ShopOutlined,
  SearchOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  DeleteOutlined
} from "@ant-design/icons";

import Sidebar from "../components/Sidebar";

import AdminNavbar from "../components/Adminnavbar";

import "../styles/Restaurant.css";

const { Option } = Select;

function Restaurants() {

  const [restaurant, setRestaurant] = useState("");

  const [location, setLocation] = useState("");

  const [contact, setContact] = useState("");

  const [email, setEmail] = useState("");

  const [cuisine, setCuisine] = useState("");

  const [deliveryTime, setDeliveryTime] = useState("");

  const [status, setStatus] = useState(true);

  const [searchText, setSearchText] = useState("");

  const [filterStatus, setFilterStatus] = useState("All");

  const [openModal, setOpenModal] = useState(false);

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {

    fetchRestaurants();

  }, []);

  const fetchRestaurants = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/restaurant/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log(data);

      if (data.success) {

        const formattedRestaurants =
          data.data.map((r) => ({

            key: r.restaurantId,

            restaurant: r.name,

            location: r.location,

            contact: r.contactNumber,

            email: r.email,

            cuisine: r.cuisine,

            deliveryTime: r.deliveryTime,

            orders: Math.floor(Math.random() * 50),

            rating:
              r.rating && r.rating !== 0
                ? r.rating
                : (4 + Math.random()).toFixed(1),

            status:
              r.open === true
                ? "Active"
                : "Inactive"

          }));

        setRestaurants(formattedRestaurants);
      }

    } catch (error) {

      console.log(error);

      message.error("Failed To Fetch Restaurants");
    }
  };

  const addRestaurant = async () => {

    if (
      restaurant === "" ||
      location === "" ||
      contact === "" ||
      email === "" ||
      cuisine === "" ||
      deliveryTime === ""
    ) {

      message.error("Please Fill All Fields");

      return;
    }

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/restaurant/save",
        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`

          },

          body: JSON.stringify({

            name: restaurant,

            location: location,

            contactNumber: contact,

            email: email,

            cuisine: cuisine,

            deliveryTime: deliveryTime,

            open: status

          })

        }
      );

      const data = await response.json();

      console.log(data);

      if (data.success) {

        message.success(
          "Restaurant Added Successfully"
        );

        fetchRestaurants();

        setRestaurant("");

        setLocation("");

        setContact("");

        setEmail("");

        setCuisine("");

        setDeliveryTime("");

        setStatus(true);

        setOpenModal(false);

      } else {

        message.error(
          data.message || "Add Failed"
        );
      }

    } catch (error) {

      console.log(error);

      message.error("Failed To Add Restaurant");
    }
  };

  const deleteRestaurant = async (id) => {

    Modal.confirm({

      title: "Delete Restaurant",

      content:
        "This restaurant and related data will be deleted permanently",

      okText: "Delete",

      okType: "danger",

      cancelText: "Cancel",

      async onOk() {

        try {

          const token =
            localStorage.getItem("token");

          const response = await fetch(
            `http://localhost:8080/restaurant/${id}`,
            {

              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`
              }

            }
          );

          const data = await response.json();

          console.log(data);

          if (response.ok) {

            message.success(
              "Restaurant Deleted Successfully"
            );

            fetchRestaurants();

          } else {

            message.error(
              data.message ||
              data.error ||
              "Delete Failed"
            );
          }

        } catch (error) {

          console.log(error);

          message.error("Server Error");
        }
      }
    });
  };

  const filteredRestaurants =
    restaurants.filter((r) => {

      const matchesSearch =
        r.restaurant
          .toLowerCase()
          .includes(
            searchText.toLowerCase()
          );

      const matchesStatus =
        filterStatus === "All"
          ? true
          : r.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

  const columns = [

    {
      title: "RESTAURANT",

      dataIndex: "restaurant",

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
      title: "LOCATION",

      dataIndex: "location"
    },

    {
      title: "CUISINE",

      dataIndex: "cuisine"
    },

    {
      title: "DELIVERY TIME",

      dataIndex: "deliveryTime"
    },

    {
      title: "CONTACT",

      dataIndex: "contact"
    },

    {
      title: "EMAIL",

      dataIndex: "email"
    },

    {
      title: "ORDERS",

      dataIndex: "orders"
    },

    {
      title: "RATING",

      dataIndex: "rating"
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
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() =>
              deleteRestaurant(record.key)
            }
          >
            Delete
          </Button>

        </Space>
      )
    }
  ];

  return (

    <div className="restaurant-page">

      <Sidebar />

      <div className="restaurant-main">

        <AdminNavbar />

        <div className="restaurant-content">

          <div className="restaurant-header">

            <div>

              <p className="manage-text">
                MANAGE
              </p>

              <h1>
                RESTAURANTS
              </h1>

              <p>
                Add, edit or manage restaurant listings
              </p>

            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="add-btn"
              onClick={() =>
                setOpenModal(true)
              }
            >
              Add Restaurant
            </Button>

          </div>

          <Row
            gutter={20}
            className="stats-row"
          >

            <Col span={8}>

              <Card className="stats-card">

                <Statistic
                  title="Total Restaurants"
                  value={restaurants.length}
                  prefix={<ShopOutlined />}
                />

              </Card>

            </Col>

            <Col span={8}>

              <Card className="stats-card">

                <Statistic
                  title="Active Restaurants"

                  value={
                    restaurants.filter(
                      (r) =>
                        r.status === "Active"
                    ).length
                  }

                  prefix={
                    <CheckCircleOutlined />
                  }
                />

              </Card>

            </Col>

            <Col span={8}>

              <Card className="stats-card">

                <Statistic
                  title="Total Orders"

                  value={
                    restaurants.reduce(
                      (total, r) =>
                        total + r.orders,
                      0
                    )
                  }

                  prefix={
                    <ShoppingCartOutlined />
                  }
                />

              </Card>

            </Col>

          </Row>

          <div className="filter-section">

            <Input
              size="large"
              placeholder="Search Restaurant..."
              prefix={<SearchOutlined />}
              className="search-input"
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
            />

            <Select
              size="large"
              className="status-filter"
              value={filterStatus}
              onChange={(value) =>
                setFilterStatus(value)
              }
            >

              <Option value="All">
                All
              </Option>

              <Option value="Active">
                Active
              </Option>

              <Option value="Inactive">
                Inactive
              </Option>

            </Select>

          </div>

          <Card className="restaurant-table-card">

            <Table
              columns={columns}
              dataSource={filteredRestaurants}
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

            title="Add Restaurant"
          >

            <Input
              placeholder="Restaurant Name"
              className="modal-input"
              value={restaurant}
              onChange={(e) =>
                setRestaurant(
                  e.target.value
                )
              }
            />

            <Input
              placeholder="Location"
              className="modal-input"
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
            />

            <Input
              placeholder="Cuisine"
              className="modal-input"
              value={cuisine}
              onChange={(e) =>
                setCuisine(
                  e.target.value
                )
              }
            />

            <Input
              placeholder="Delivery Time"
              className="modal-input"
              value={deliveryTime}
              onChange={(e) =>
                setDeliveryTime(
                  e.target.value
                )
              }
            />

            <Input
              placeholder="Contact"
              className="modal-input"
              value={contact}
              onChange={(e) =>
                setContact(
                  e.target.value
                )
              }
            />

            <Input
              placeholder="Email"
              className="modal-input"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <div className="switch-section">

              <span>Status</span>

              <Switch
                checked={status}
                onChange={(checked) =>
                  setStatus(checked)
                }
              />

            </div>

            <Button
              type="primary"
              block
              className="submit-btn"
              onClick={addRestaurant}
            >
              Add Restaurant
            </Button>

          </Modal>

        </div>

      </div>

    </div>
  );
}

export default Restaurants;