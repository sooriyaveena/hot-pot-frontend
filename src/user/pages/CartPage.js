import React, { useEffect, useState } from "react";

import { Button, Input, Divider, message } from "antd";

import { DeleteOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import axiosInstance from "../utils/axiosInstance";

import "../styles/cart.css";

function CartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    axiosInstance

      .get(`/cart/${user.userId}`)

      .then((res) => {
        console.log("CART RESPONSE", res.data);

        setCart(res.data.data);
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const cartItems = cart?.items || [];

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,

    0,
  );

  const deliveryFee = 0;

  const taxes = Math.floor(subtotal * 0.05);

  let discount = 0;

  if (appliedPromo === "SAVE50") {
    discount = 50;
  }

  if (appliedPromo === "SAVE10") {
    discount = subtotal * 0.1;
  }
  const total = subtotal + deliveryFee + taxes - discount;

  const increaseQuantity = async (itemId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await axiosInstance.put(
        `/cart/${user.userId}/items/${itemId}?change=1`,
      );

      setCart(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const decreaseQuantity = async (itemId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await axiosInstance.put(
        `/cart/${user.userId}/items/${itemId}?change=-1`,
      );

      setCart(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const removeItem = async (itemId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await axiosInstance.delete(
        `/cart/${user.userId}/items/${itemId}`,
      );

      setCart(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const clearCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await axiosInstance.delete(`/cart/${user.userId}`);

      setCart(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const applyPromoCode = () => {
    if (promoCode !== "SAVE50" && promoCode !== "SAVE10") {
      message.error("Invalid promo code");

      return;
    }

    setAppliedPromo(promoCode);

    message.success("Promo code applied");
  };

  const handleCheckout = () => {
    if (!cartItems.length) {
      message.error("Cart is empty");

      return;
    }

    if (total < 100) {
      message.error("Minimum order amount is ₹100");

      return;
    }

    navigate("/payment", {
      state: {
        subtotal,

        deliveryFee,

        taxes,

        discount,

        total,
      },
    });
  };

  return (
    <div className="cart-page">
      <Navbar />

      <div className="cart-wrapper">
     

        <div className="cart-left">
          <div className="cart-header">
            <h1>Your Cart</h1>

            {cartItems.length > 0 && <span onClick={clearCart}>Clear all</span>}
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <img
                src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
                alt="Empty Cart"
              />

              <h2>Your cart is empty</h2>

              <p>Add delicious food items to continue ordering</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="modern-cart-item" key={item.itemId}>
                <div className="modern-cart-left">
                  <div className="food-icon">🍔</div>

                  <div className="food-details">
                    <h3>{item.itemName}</h3>

                    <p>Delicious food item</p>

                    <h4>₹{item.price}</h4>
                  </div>
                </div>

                <div className="modern-cart-right">
                  <div className="modern-quantity-box">
                    <button onClick={() => decreaseQuantity(item.itemId)}>
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increaseQuantity(item.itemId)}>
                      +
                    </button>
                  </div>

                  <DeleteOutlined
                    className="modern-delete-icon"
                    onClick={() => removeItem(item.itemId)}
                  />
                </div>
              </div>
            ))
          )}
        </div>

     

        <div className="cart-right">
          <h1>Order Summary</h1>

          <Divider />

          <div className="promo-box">
            <p>Have a promo code?</p>

            <div className="promo-input">
              <Input
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />

              <Button className="apply-btn" onClick={applyPromoCode}>
                Apply
              </Button>
            </div>
          </div>

          <div className="price-details">
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

              <span>-₹{discount}</span>
            </div>
          </div>

          <Divider dashed />

          <div className="total-box">
            <h2>Total</h2>

            <h2>₹{Math.max(total, 0)}</h2>
          </div>

          <Button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
