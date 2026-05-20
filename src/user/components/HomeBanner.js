import React from "react";

import { Button } from "antd";

import "../styles/home.css";
import { useNavigate } from "react-router-dom";
function HomeBanner() {
  const navigate = useNavigate();
  return (
    <div className="banner-container">
      <div className="banner-left">
        <span className="offer-text">✴ EXCLUSIVE OFFER TODAY</span>

        <h1>
          Hungry? We've
          <br />
          got you covered.
        </h1>

        <p>Order from 86+ restaurants near you. Fast delivery, fresher food.</p>

        <Button className="explore-btn" onClick={() => navigate("/restaurant")}>
          Explore Menu
        </Button>
      </div>

      <div className="food-icon">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2515/2515183.png"
          alt="Food"
        />
      </div>
    </div>
  );
}

export default HomeBanner;
