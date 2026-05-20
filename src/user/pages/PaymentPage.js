import React, { useState, useEffect } from "react";
import { Card, Radio, Button, Input, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import {
  CreditCardOutlined,
  WalletOutlined,
  DollarOutlined,
} from "@ant-design/icons";

import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axiosInstance";

import "../styles/payment.css";

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartItems, setCartItems] = useState([]);

  const [paymentMethod, setPaymentMethod] =
    useState("CREDIT_CARD");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    axiosInstance
      .get(`/cart/${user.userId}`)
      .then((res) => {
        setCartItems(res.data.data.items || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const {
    subtotal,
    deliveryFee,
    taxes,
    discount = 0,
    total,
  } = location.state || {};

  const handlePayment = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      message.error("Please login first");
      return;
    }

    if (paymentMethod === "CREDIT_CARD") {
      const cardInput = document.querySelector(
        'input[placeholder="Card Number"]',
      );

      const cvvInput =
        document.querySelector('input[placeholder="CVV"]');

      if (!cardInput.value || cardInput.value.length !== 16) {
        message.error("Invalid card number");
        return;
      }

      if (!cvvInput.value || cvvInput.value.length !== 3) {
        message.error("Invalid CVV");
        return;
      }
    }

    if (paymentMethod === "UPI") {
      const upiInput = document.querySelector(
        'input[placeholder="Enter UPI ID"]',
      );

      if (!upiInput.value.includes("@")) {
        message.error("Invalid UPI ID");
        return;
      }
    }

    try {
      const cartResponse = await axiosInstance.get(
        `/cart/${user.userId}`,
      );

      const cart = cartResponse.data.data;

      console.log({
        userId: user.userId,
        cartId: cart.cartId,
        address: user.address,
        paymentMethod,
      });

      await axiosInstance.post("/order/place", {
        userId: user.userId,
        cartId: cart.cartId,
        address: user.address,
        paymentMethod,
      });

      message.success("Payment Successful");

      navigate("/orders");
    } catch (err) {
      console.log(err);

      message.error(
        err.response?.data?.message || "Payment Failed",
      );
    }
  };

  return (
    <div className="payment-page">
      <Navbar />

      <div className="payment-wrapper">
        <div className="payment-left">
          <h1>Payment Method</h1>

          <Radio.Group
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(e.target.value)
            }
            className="payment-options"
          >
            <Card
              className={
                paymentMethod === "CREDIT_CARD"
                  ? "payment-card active-payment"
                  : "payment-card"
              }
            >
              <Radio value="CREDIT_CARD">
                <CreditCardOutlined />
                Credit / Debit Card
              </Radio>
            </Card>

            <Card
              className={
                paymentMethod === "UPI"
                  ? "payment-card active-payment"
                  : "payment-card"
              }
            >
              <Radio value="UPI">
                <WalletOutlined />
                UPI Payment
              </Radio>
            </Card>

            <Card
              className={
                paymentMethod ===
                "CASH_ON_DELIVERY"
                  ? "payment-card active-payment"
                  : "payment-card"
              }
            >
              <Radio value="CASH_ON_DELIVERY">
                <DollarOutlined />
                Cash on Delivery
              </Radio>
            </Card>
          </Radio.Group>

          {paymentMethod === "CREDIT_CARD" && (
            <div className="payment-form">
              <Input placeholder="Card Number" />

              <div className="payment-row">
                <Input placeholder="MM/YY" />

                <Input placeholder="CVV" />
              </div>

              <Input placeholder="Card Holder Name" />
            </div>
          )}

          {paymentMethod === "UPI" && (
            <div className="payment-form">
              <Input placeholder="Enter UPI ID" />
            </div>
          )}
        </div>

        <div className="payment-right">
          <h1>Order Summary</h1>

          <div className="payment-summary">
            <div>
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div>
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>

            <div>
              <span>Taxes</span>
              <span>₹{taxes}</span>
            </div>

            <div>
              <span>Discount</span>
              <span>- ₹{discount}</span>
            </div>
          </div>

          <div className="payment-total">
            <h2>Total</h2>
            <h2>₹{total}</h2>
          </div>

          <Button
            className="pay-btn"
            onClick={handlePayment}
          >
            Pay ₹{total}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;