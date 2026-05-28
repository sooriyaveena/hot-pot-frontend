import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axiosInstance";

import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import "../styles/orders.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) return;

      const res = await axiosInstance.get(`/order/user/${user.userId}`);

      console.log("ORDERS RESPONSE", res.data);

      const ordersData = res.data.data || [];

      const normalizedOrders = ordersData.map((order) => ({
        ...order,
        status: order.status?.toUpperCase(),
      }));

      console.log("IS ARRAY:", Array.isArray(ordersData));
      console.log("TOTAL ORDERS:", ordersData.length);
      console.log("ALL ORDERS:", normalizedOrders);

      setOrders(normalizedOrders);
    } catch (err) {
      console.log(err);
    }
  };

  const filters = ["ALL", "PLACED", "PREPARING", "DELIVERED", "CANCELLED"];

  const statusPriority = {
    PLACED: 1,
    PREPARING: 2,
    DELIVERED: 3,
    CANCELLED: 4,
  };

  const filteredOrders = (
    selectedFilter === "ALL"
      ? orders
      : orders.filter(
          (order) =>
            order.status?.toUpperCase() ===
            selectedFilter.toUpperCase(),
        )
  ).sort(
    (a, b) =>
      (statusPriority[a.status?.toUpperCase()] || 99) -
      (statusPriority[b.status?.toUpperCase()] || 99),
  );

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return <CheckCircleOutlined className="green-icon" />;

      case "CANCELLED":
        return <CloseCircleOutlined className="red-icon" />;

      default:
        return <ClockCircleOutlined className="orange-icon" />;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await axiosInstance.put(
        `/order/cancel/${orderId}`,
      );

      console.log("CANCEL RESPONSE", response.data);

      setOrders(
        orders.map((order) =>
          order.orderId === orderId
            ? {
                ...order,
                status: "CANCELLED",
              }
            : order,
        ),
      );
    } catch (err) {
      console.log(err);

      alert("Failed to cancel order");
    }
  };

  return (
    <div className="orders-page">
      <Navbar />

      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>

          <p>Track all your food orders</p>
        </div>

        <div className="order-filters">
          {filters.map((item) => (
            <button
              key={item}
              className={
                selectedFilter === item ? "active-filter" : ""
              }
              onClick={() => setSelectedFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-orders">
            No Orders Found
          </div>
        ) : (
          <div className="orders-list">
            {console.log("FILTERED ORDERS:", filteredOrders)}

            {filteredOrders.map((order) => {
              console.log(
                "RENDERING ORDER:",
                order.orderId,
              );

              return (
                <div
                  key={order.orderId}
                  className="order-card"
                >
                  <div className="order-top">
                    <div className="restaurant-info">
                      <img
                        className="restaurant-order-image"
                        src={
                          order.restaurant?.image ||
                          "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                        }
                        alt="restaurant"
                      />

                      <div className="restaurant-details">
                        <h2>
                          {order.restaurant?.name ||
                            "Restaurant"}
                        </h2>

                        <p>Order #{order.orderId}</p>
                      </div>
                    </div>

                    <div
                      className={`status-badge ${order.status?.toLowerCase()}`}
                    >
                      {getStatusIcon(order.status)}

                      <span>
                        {order.status?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.orderItems?.map((item) => {
                      return (
                        <div
                          key={item.orderItemId}
                          className="item-pill"
                        >
                          {item.item?.name ||
                            item.menuItem?.name ||
                            "Food Item"}{" "}
                          x {item.quantity}
                        </div>
                      );
                    })}
                  </div>

                  <div className="order-middle">
                    <div className="order-info">
                      <span>Payment Method</span>

                      <p>{order.paymentMethod}</p>
                    </div>

                    <div className="order-info">
                      <span>Delivery Address</span>

                      <p>{order.shippingAddress}</p>
                    </div>
                  </div>

                  <div className="order-bottom">
                    <div>
                      <span className="price-label">
                        Total Amount
                      </span>

                      <h1 className="order-price">
                        ₹{order.totalAmount}
                      </h1>
                    </div>

                    {order.status !== "DELIVERED" &&
                      order.status !== "CANCELLED" && (
                        <button
                          className="cancel-order-btn"
                          onClick={() =>
                            cancelOrder(order.orderId)
                          }
                        >
                          Cancel Order
                        </button>
                      )}
                  </div>

                  {order.status === "DELIVERED" && (
                    <button
                      className="feedback-btn"
                      onClick={() =>
                        navigate(
                          `/feedback/${order.restaurant?.restaurantId}/${order.orderId}`,
                        )
                      }
                    >
                      ⭐ Rate & Review
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;