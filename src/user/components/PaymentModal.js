import React, { useState } from "react";

import { Modal, Button, Input, message } from "antd";

import {
  CreditCardOutlined,
  WalletOutlined,
  BankOutlined,
  DollarOutlined,
  HomeOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

import "../styles/paymentModal.css";

function PaymentModal({ open, onClose }) {
  const navigate = useNavigate();

  const { cartItems, clearCart } = useCart();

  const [selectedMethod, setSelectedMethod] = useState("UPI");

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,

    0,
  );

  const taxes = Math.floor(subtotal * 0.05);

  const deliveryFee = 30;

  const total = subtotal + taxes + deliveryFee;

  const handlePlaceOrder = () => {
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrder = {
      id: Date.now(),

      items: cartItems,

      total,

      status: "On the Way",

      paymentMethod: selectedMethod,

      date: new Date().toLocaleString(),
    };

    localStorage.setItem(
      "orders",

      JSON.stringify([newOrder, ...existingOrders]),
    );

    clearCart();

    message.success("Order Placed Successfully");

    onClose();

    navigate("/orders");
  };

  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      centered
      width={480}
      className="payment-modal"
    >

      <div className="payment-header">
        <h1>Checkout</h1>

        <CloseOutlined onClick={onClose} />
      </div>

    

      <div className="address-box">
        <div className="address-left">
          <HomeOutlined />

          <div>
            <span>HOME</span>

            <p>42, 5th Avenue, Anna Nagar, Chennai - 600040</p>
          </div>
        </div>

        <button>Change</button>
      </div>

  

      <h3 className="payment-title">Payment Method</h3>

      <div className="payment-grid">
        <div
          className={
            selectedMethod === "UPI"
              ? "payment-option active-option"
              : "payment-option"
          }
          onClick={() => setSelectedMethod("UPI")}
        >
          <WalletOutlined />

          <span>UPI</span>
        </div>

        <div
          className={
            selectedMethod === "CARD"
              ? "payment-option active-option"
              : "payment-option"
          }
          onClick={() => setSelectedMethod("CARD")}
        >
          <CreditCardOutlined />

          <span>Card</span>
        </div>

        <div
          className={
            selectedMethod === "COD"
              ? "payment-option active-option"
              : "payment-option"
          }
          onClick={() => setSelectedMethod("COD")}
        >
          <DollarOutlined />

          <span>Cash on Delivery</span>
        </div>

        <div
          className={
            selectedMethod === "NETBANKING"
              ? "payment-option active-option"
              : "payment-option"
          }
          onClick={() => setSelectedMethod("NETBANKING")}
        >
          <BankOutlined />

          <span>Net Banking</span>
        </div>
      </div>

   

      {selectedMethod === "UPI" && (
        <div className="payment-form">
          <Input placeholder="Enter UPI ID" />
        </div>
      )}

      {selectedMethod === "CARD" && (
        <div className="payment-form">
          <Input placeholder="Card Number" />

          <div className="card-row">
            <Input placeholder="MM/YY" />

            <Input placeholder="CVV" />
          </div>

          <Input placeholder="Card Holder Name" />
        </div>
      )}

      {selectedMethod === "NETBANKING" && (
        <div className="payment-form">
          <Input placeholder="Bank Name" />

          <Input placeholder="Account Number" />
        </div>
      )}


      <div className="payment-summary">
        <div>
          <span>Subtotal</span>

          <span>₹{subtotal}</span>
        </div>

        <div>
          <span>Delivery + Tax</span>

          <span>₹{deliveryFee + taxes}</span>
        </div>

        <div className="summary-total">
          <span>Total</span>

          <span>₹{total}</span>
        </div>
      </div>

   

      <Button className="place-order-btn" onClick={handlePlaceOrder}>
        🍕 Place Order — ₹{total}
      </Button>
    </Modal>
  );
}

export default PaymentModal;
