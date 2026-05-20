import React, { useState, useEffect } from "react";

import { Rate, Input, Button, message } from "antd";

import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import axiosInstance from "../utils/axiosInstance";

import "../styles/feedback.css";

function Feedback() {
  const { restaurantId, orderId } = useParams();

  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);

  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState("");

  useEffect(() => {
    axiosInstance

      .get(`/restaurant/${restaurantId}`)

      .then((res) => {
        setRestaurant(res.data.data);
      })

      .catch((err) => {
        console.log(err);
      });
  }, [restaurantId]);

  const submitFeedback = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      await axiosInstance.post(
        "/feedback/add",

        {
          userId: user.userId,

          restaurantId: parseInt(restaurantId),

          orderId: parseInt(orderId),

          rating,

          comment,
        },
      );

      message.success("Feedback submitted successfully");

      navigate("/orders");
    } catch (err) {
      console.log(err);

      message.error("Failed to submit feedback");
    }
  };

  return (
    <div className="feedback-page">
      <Navbar />

      <div className="feedback-container">
        {restaurant && (
          <>
            <img
              src={restaurant.image}
              alt="restaurant"
              className="feedback-image"
            />

            <h1>{restaurant.name}</h1>

            <p>{restaurant.cuisine}</p>

            <div className="feedback-rating">
              <h3>Rate Your Experience</h3>

              <Rate value={rating} onChange={setRating} />
            </div>

            <Input.TextArea
              rows={5}
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <Button className="submit-feedback-btn" onClick={submitFeedback}>
              Submit Review
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default Feedback;
