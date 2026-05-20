import React, { useEffect, useState } from "react";

import {
  Card,
  Row,
  Col,
  Tag,
  Table,
  message
} from "antd";

import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ShopOutlined
} from "@ant-design/icons";

import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/Adminnavbar";

import "../styles/Dashboard.css";

function Dashboard() {

  const [usersCount, setUsersCount] = useState(0);

  const [orders, setOrders] = useState([]);

  const [restaurantsCount, setRestaurantsCount] = useState(0);

  const [revenue, setRevenue] = useState(0);

  const [preparingCount, setPreparingCount] = useState(0);

  const [deliveryCount, setDeliveryCount] = useState(0);

  const [deliveredCount, setDeliveredCount] = useState(0);

  const [cancelledCount, setCancelledCount] = useState(0);

  const [restaurantStats, setRestaurantStats] = useState([]);

  useEffect(() => {

    fetchDashboardData();

  }, []);

  const fetchDashboardData = async () => {

    try {

      const token = localStorage.getItem("token");

      const usersResponse = await fetch(
        "http://localhost:8080/users/getallusers",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const usersData = await usersResponse.json();

      const usersArray = Array.isArray(usersData.data)
        ? usersData.data
        : [];

      setUsersCount(usersArray.length);

      const ordersResponse = await fetch(
        "http://localhost:8080/order/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const ordersData = await ordersResponse.json();

      const ordersArray = Array.isArray(ordersData.data)
        ? ordersData.data
        : [];

      const formattedOrders = ordersArray.map((order) => ({

        key: order.orderId,

        id: `#HP-${order.orderId}`,

        customer:
          order.user?.name || "Unknown",

        restaurant:
          order.restaurant?.name ||
          "Restaurant",

        items:
          order.orderItems?.length || 0,

        amount:
          `₹${Number(order.totalAmount || 0).toFixed(2)}`,

        status:
          order.status || "PLACED"

      }));

      setOrders(formattedOrders);

      let totalRevenue = 0;

      ordersArray.forEach((order) => {

        totalRevenue += order.totalAmount || 0;

      });

      setRevenue(totalRevenue);

      setPreparingCount(
        ordersArray.filter(
          (o) => o.status === "PREPARING"
        ).length
      );

      setDeliveryCount(
        ordersArray.filter(
          (o) => o.status === "ON_DELIVERY"
        ).length
      );

      setDeliveredCount(
        ordersArray.filter(
          (o) => o.status === "DELIVERED"
        ).length
      );

      setCancelledCount(
        ordersArray.filter(
          (o) => o.status === "CANCELLED"
        ).length
      );

      const restaurantResponse = await fetch(
        "http://localhost:8080/restaurant/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const restaurantData =
        await restaurantResponse.json();

      const restaurantArray =
        Array.isArray(restaurantData.data)
          ? restaurantData.data
          : [];

      setRestaurantsCount(
        restaurantArray.length
      );

      const stats = restaurantArray
  .map((restaurant) => {

    const restaurantOrders = ordersArray.filter(
      (order) =>
        order.restaurant?.restaurantId ===
        restaurant.restaurantId
    );

    const restaurantRevenue = restaurantOrders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    return {
      id: restaurant.restaurantId,
      name: restaurant.name,
      image: restaurant.image,
      orders: restaurantOrders.length,
      revenue: restaurantRevenue,
    };
  })

  .filter((restaurant) => restaurant.orders > 0);

setRestaurantStats(stats);

      setRestaurantStats(stats);

    } catch (error) {

      console.log(error);

      message.error(
        "Failed To Load Dashboard"
      );
    }
  };

  const columns = [

    {
      title: "ORDER ID",
      dataIndex: "id",
    },

    {
      title: "CUSTOMER",
      dataIndex: "customer",
    },

    {
      title: "RESTAURANT",
      dataIndex: "restaurant",
    },

    {
      title: "ITEMS",
      dataIndex: "items",
    },

    {
      title: "AMOUNT",
      dataIndex: "amount",
    },

    {
      title: "STATUS",
      dataIndex: "status",

      render: (status) => (

        <Tag
          color={
            status === "DELIVERED"
              ? "green"
              : status === "PREPARING"
              ? "orange"
              : status === "ON_DELIVERY"
              ? "blue"
              : "red"
          }
        >
          {status}
        </Tag>
      )
    }
  ];

  return (

    <div className="dashboard-container">

      <Sidebar />

      <div className="dashboard-main">

        <AdminNavbar />

        <div className="dashboard-content">

          <div className="dashboard-header">

            <div>

              <p className="overview-text">
                OVERVIEW
              </p>

              <h1 className="dashboard-title">
                ADMIN DASHBOARD
              </h1>

            </div>

          </div>

          <Row gutter={20} className="stats-row">

            <Col span={6}>

              <Card className="dashboard-card blue-top">

                <UserOutlined className="dashboard-icon" />

                <h1>{usersCount}</h1>

                <p>Total Users</p>

              </Card>

            </Col>

            <Col span={6}>

              <Card className="dashboard-card green-top">

                <ShoppingCartOutlined className="dashboard-icon" />

                <h1>{orders.length}</h1>

                <p>Total Orders</p>

              </Card>

            </Col>

            <Col span={6}>

              <Card className="dashboard-card orange-top">

                <DollarOutlined className="dashboard-icon" />

                <h1>
                  ₹
                  {revenue.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h1>

                <p>Total Revenue</p>

              </Card>

            </Col>

            <Col span={6}>

              <Card className="dashboard-card red-top">

                <ShopOutlined className="dashboard-icon" />

                <h1>{restaurantsCount}</h1>

                <p>Restaurants</p>

              </Card>

            </Col>

          </Row>

          <div className="order-tags">

            <Tag color="orange">
              Preparing: {preparingCount}
            </Tag>

            <Tag color="blue">
              On Delivery: {deliveryCount}
            </Tag>

            <Tag color="green">
              Delivered: {deliveredCount}
            </Tag>

            <Tag color="red">
              Cancelled: {cancelledCount}
            </Tag>

          </div>

          <Row gutter={20} style={{ marginBottom: "25px" }}>

            {restaurantStats.map((restaurant) => (

              <Col span={8} key={restaurant.id}>

                <Card
                  style={{
                    borderRadius: "20px",
                    border: "none",
                    overflow: "hidden",
                    boxShadow:
                      "0 4px 14px rgba(0,0,0,0.08)",
                    marginBottom: "20px",
                  }}
                  bodyStyle={{
                    padding: 0,
                  }}
                >

                  <img
                    src={
                      restaurant.image ||
                      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                    }
                    alt={restaurant.name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />

                  <div style={{ padding: "20px" }}>

                    <h2
                      style={{
                        marginBottom: "8px",
                        fontSize: "22px",
                        fontWeight: "600",
                      }}
                    >
                      {restaurant.name}
                    </h2>

                    <p
                      style={{
                        color: "#777",
                        marginBottom: "12px",
                      }}
                    >
                      {restaurant.orders} Orders
                    </p>

                    <Tag color="orange">
                      ₹
                      {restaurant.revenue.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </Tag>

                  </div>

                </Card>

              </Col>

            ))}

          </Row>

          <Card className="dashboard-table-card">

            <div className="table-title">
              Recent Orders
            </div>

            <Table
              columns={columns}
              dataSource={orders}
              pagination={false}
            />

          </Card>

        </div>

      </div>

    </div>

  );
}

export default Dashboard;