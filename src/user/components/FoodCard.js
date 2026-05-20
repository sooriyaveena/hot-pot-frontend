import React from "react";

import { Button, message } from "antd";

import axiosInstance from "../utils/axiosInstance";

import "../styles/foodcard.css";

function FoodCard({ food }) {
  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      message.error("Please login first");

      return;
    }

    try {
      await axiosInstance.post(
        `/cart/${user.userId}/items/${food.itemId || food.menuItemId}?quantity=1`,
      );

      message.success("Added to cart");
    } catch (err) {
      console.log(err);

      message.error("Failed to add item");
    }
  };

  return (
    <div className="food-card">
      <img
        src={
          food.image ||
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
        }
        alt={food.name}
        className="food-image"
      />

      <div className="food-content">
        <div className="food-top">
          <h3>{food.name}</h3>

          <span className="food-price">₹{food.price}</span>
        </div>

        <p className="food-description">
          {food.description || "Delicious food item"}
        </p>

        <div className="food-bottom">
          <span className={food.veg ? "veg-tag" : "nonveg-tag"}>
            {food.veg ? "Veg" : "Non-Veg"}
          </span>

          <Button className="add-btn" onClick={handleAddToCart}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
