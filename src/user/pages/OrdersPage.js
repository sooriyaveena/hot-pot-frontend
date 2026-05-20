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
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    axiosInstance

      .get(`/order/user/${user.userId}`)

      .then((res) => {
        console.log("ORDERS RESPONSE", res.data);

        setOrders(res.data.data || []);
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);

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
      : orders.filter((order) => order.status === selectedFilter)
  ).sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);
  const getStatusIcon = (status) => {
    switch (status) {
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
      const response = await axiosInstance.put(`/order/cancel/${orderId}`);

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
              className={selectedFilter === item ? "active-filter" : ""}
              onClick={() => setSelectedFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-orders">No Orders Found</div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => {
              console.log("ORDER", order);

              return (
                <div key={order.orderId} className="order-card">
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
                        <h2>{order.restaurant?.name || "Restaurant"}</h2>

                        <p>Order #{order.orderId}</p>
                      </div>
                    </div>

                    <div
                      className={`status-badge
                        ${order.status.toLowerCase()}`}
                    >
                      {getStatusIcon(order.status)}

                      <span>{order.status}</span>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.orderItems?.map((item) => {
                      console.log("ITEM", item);

                      return (
                        <div key={item.orderItemId} className="item-pill">
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
                      <span className="price-label">Total Amount</span>

                      <h1 className="order-price">₹{order.totalAmount}</h1>
                    </div>

                    {order.status !== "DELIVERED" &&
                      order.status !== "CANCELLED" && (
                        <button
                          className="cancel-order-btn"
                          onClick={() => cancelOrder(order.orderId)}
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
