import React, { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Adminnavbar from "../components/Adminnavbar";

import "../styles/Orders.css";

import {
  Card,
  Input,
  Row,
  Col,
  Select,
  Table,
  Tag,
  Space,
  Avatar,
  Progress,
  Button,
  message
} from "antd";

import {
  SearchOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CarOutlined,
  DeleteOutlined
} from "@ant-design/icons";

const { Option } = Select;

function Orders() {

  const [searchText, setSearchText] = useState("");

  const [statusFilter, setStatusFilter] =useState("all");

  const [paymentFilter, setPaymentFilter] =useState("all");

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    fetchOrders();

  }, []);

 

  const fetchOrders = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/order/all",
        {

          method: "GET",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`

          }

        }
      );

      console.log(
        "STATUS:",
        response.status
      );

      const data =
        await response.json();

      console.log(
        "ORDER API:",
        data
      );

      if (!data.success) {

        message.error(
          "Failed To Fetch Orders"
        );

        return;

      }

      const formattedOrders =
        data.data.map((order) => ({

          key: order.orderId,

          orderId:
            `#HP-${order.orderId}`,

          customer:
            order.user?.name
            || "Unknown User",

          restaurant:
            order.restaurant
              ?.restaurantName
            || "Restaurant",

          items:
            order.orderItems?.length
            || 0,

          amount:
            `₹${order.totalAmount || 0}`,

          payment:
            order.paymentMethod
            || "COD",

          address:
            order.address
            || "No Address",

        

          status:

            order.status === "PREPARING"
              ? "Preparing"

            : order.status === "ON_DELIVERY"
              ? "On Delivery"

            : order.status === "DELIVERED"
              ? "Delivered"

            : order.status === "CANCELLED"
              ? "Cancelled"

            : "Preparing"

        }));

      console.log(
        "FORMATTED ORDERS:",
        formattedOrders
      );

      setOrders(formattedOrders);

    }

    catch (error) {

      console.log(error);

      message.error(
        "Error Fetching Orders"
      );

    }

  };


const handleDelete = async (id) => {

  try {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:8080/order/delete/${id}`,
      {

        method: "DELETE",

        headers: {

          Authorization:
            `Bearer ${token}`

        }

      }
    );

    const data =
      await response.json();

    console.log(data);

    if (response.ok && data.success) {

      message.success(
        "Order Deleted Successfully"
      );

      fetchOrders();

    }

    else {

      message.error(
        data.message ||
        "Delete Failed"
      );

    }

  }

  catch (error) {

    console.log(error);

    message.error(
      "Server Error"
    );

  }

};


  const handleStatusChange = async (
    id,
    value
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      const backendStatusMap = {

        "Preparing":
          "PREPARING",

        "On Delivery":
          "ON_DELIVERY",

        "Delivered":
          "DELIVERED",

        "Cancelled":
          "CANCELLED"

      };

      const backendStatus =
        backendStatusMap[value];

      const response = await fetch(
        `http://localhost:8080/order/update-status/${id}?status=${backendStatus}`,
        {

          method: "PUT",

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }
      );

      const data =
        await response.json();

      console.log(data);

      if (data.success) {

        message.success(
          "Order Status Updated"
        );

        const updatedOrders =
          orders.map((order) => {

            if (order.key === id) {

              return {

                ...order,

                status: value

              };

            }

            return order;

          });

        setOrders(updatedOrders);

      }

    }

    catch (error) {

      console.log(error);

      message.error(
        "Status Update Failed"
      );

    }

  };

 

  const filteredOrders =
    orders.filter((order) => {

      const searchMatch =

        order.customer
          .toLowerCase()
          .includes(
            searchText.toLowerCase()
          )

        ||

        order.orderId
          .toLowerCase()
          .includes(
            searchText.toLowerCase()
          );

    const statusMatch =

  statusFilter === "all"

  ||

  order.status
    .toLowerCase()
    .trim()

  ===

  statusFilter
    .toLowerCase()
    .trim();

      const paymentMatch =

        paymentFilter === "all"

        ||

        order.payment === paymentFilter;

      return (

        searchMatch &&
        statusMatch &&
        paymentMatch

      );

    });



  const preparingCount =
    orders.filter(
      (order) =>
        order.status === "Preparing"
    ).length;

  const deliveryCount =
    orders.filter(
      (order) =>
        order.status === "On Delivery"
    ).length;

  const deliveredCount =
    orders.filter(
      (order) =>
        order.status === "Delivered"
    ).length;

  const cancelledCount =
    orders.filter(
      (order) =>
        order.status === "Cancelled"
    ).length;

 

  const columns = [

    {
      title: "ORDER ID",

      dataIndex: "orderId",

      render: (text) => (

        <a href="/">
          {text}
        </a>

      )
    },

    {
      title: "CUSTOMER",

      dataIndex: "customer",

      render: (text) => (

        <Space>

          <Avatar
            style={{
              backgroundColor:
                "#ff5a1f"
            }}
          >
            {text[0]}
          </Avatar>

          {text}

        </Space>
      )
    },

    {
      title: "RESTAURANT",

      dataIndex: "restaurant"
    },

    {
      title: "ITEMS",

      dataIndex: "items"
    },

    {
      title: "AMOUNT",

      dataIndex: "amount",

      render: (amount) => (

        <span
          style={{
            color: "#1db954",

            fontWeight: "600"
          }}
        >
          {amount}
        </span>

      )
    },

    {
      title: "PAYMENT",

      dataIndex: "payment",

      render: (payment) => (

        <Tag
          color={
            payment === "UPI"
              ? "blue"

              : payment === "Card"
              ? "purple"

              : "orange"
          }
        >
          {payment}
        </Tag>

      )
    },

    {
      title: "ADDRESS",

      dataIndex: "address"
    },

    {
      title: "STATUS",

      dataIndex: "status",

      render: (status) => {

        let color = "";

        if (
          status === "Preparing"
        ) {

          color = "orange";

        }

        else if (
          status === "On Delivery"
        ) {

          color = "blue";

        }

        else if (
          status === "Delivered"
        ) {

          color = "green";

        }

        else {

          color = "red";

        }

        return (

          <Tag color={color}>
            {status}
          </Tag>

        );

      }
    },


    {
      title: "ACTION",

      render: (_, record) => (

        <Button

          danger

          icon={
            <DeleteOutlined />
          }

          onClick={() =>
            handleDelete(
              record.key
            )
          }
        >
          Delete
        </Button>

      )
    }

  ];

  return (

    <div className="orders-page">

      <Sidebar />

      <div className="orders-main">

        <Adminnavbar />

        <div className="orders-content">

       

          <div className="orders-header">

            <div>

              <p className="manage-text">
                MANAGE
              </p>

              <h1 className="orders-title">
                ALL ORDERS
              </h1>

              <p className="orders-subtitle">
                View, filter and update order statuses
              </p>

            </div>

          </div>

         

          <Row gutter={[20, 20]}>

            <Col span={6}>

              <Card className="status-card preparing-card">

                <Space>

                  <ShoppingCartOutlined />

                  <span>
                    Preparing:
                    {" "}
                    {preparingCount}
                  </span>

                </Space>

                <Progress
                  percent={
                    orders.length
                      ? (
                        preparingCount
                        / orders.length
                      ) * 100
                      : 0
                  }
                  showInfo={false}
                />

              </Card>

            </Col>

            <Col span={6}>

              <Card className="status-card delivery-card">

                <Space>

                  <CarOutlined />

                  <span>
                    On Delivery:
                    {" "}
                    {deliveryCount}
                  </span>

                </Space>

                <Progress
                  percent={
                    orders.length
                      ? (
                        deliveryCount
                        / orders.length
                      ) * 100
                      : 0
                  }
                  showInfo={false}
                />

              </Card>

            </Col>

            <Col span={6}>

              <Card className="status-card success-card">

                <Space>

                  <CheckCircleOutlined />

                  <span>
                    Delivered:
                    {" "}
                    {deliveredCount}
                  </span>

                </Space>

                <Progress
                  percent={
                    orders.length
                      ? (
                        deliveredCount
                        / orders.length
                      ) * 100
                      : 0
                  }
                  showInfo={false}
                />

              </Card>

            </Col>

            <Col span={6}>

              <Card className="status-card cancel-card">

                <Space>

                  <CloseCircleOutlined />

                  <span>
                    Cancelled:
                    {" "}
                    {cancelledCount}
                  </span>

                </Space>

                <Progress
                  percent={
                    orders.length
                      ? (
                        cancelledCount
                        / orders.length
                      ) * 100
                      : 0
                  }
                  showInfo={false}
                />

              </Card>

            </Col>

          </Row>

        

          <Card className="filter-card">

            <Row gutter={[16, 16]}>

              <Col span={10}>

                <Input

                  size="large"

                  placeholder="Search order ID, customer..."

                  prefix={
                    <SearchOutlined />
                  }

                  value={searchText}

                  onChange={(e) =>
                    setSearchText(
                      e.target.value
                    )
                  }
                />

              </Col>

              <Col span={4}>

                <Select

                  size="large"

                  value={statusFilter}

                  style={{
                    width: "100%"
                  }}

                  onChange={(value) =>
                    setStatusFilter(
                      value
                    )
                  }
                >

                  <Option value="all">
                    All Status
                  </Option>

                  <Option value="Preparing">
                    Preparing
                  </Option>

                  <Option value="On Delivery">
                    On Delivery
                  </Option>

                  <Option value="Delivered">
                    Delivered
                  </Option>

                  <Option value="Cancelled">
                    Cancelled
                  </Option>

                </Select>

              </Col>

            </Row>

          </Card>

         

          <Card className="orders-table-card">

            <Table
              columns={columns}
              dataSource={filteredOrders}
              pagination={false}
              scroll={{ x: 1400 }}
            />

          </Card>

        </div>

      </div>

    </div>

  );
}

export default Orders;