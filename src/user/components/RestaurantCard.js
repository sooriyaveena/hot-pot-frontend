import React, { useEffect, useState } from "react";

import { Card, Tag, Rate } from "antd";

import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

    setFavorites(savedFavorites);
  }, []);

  const isFavorite = favorites.includes(restaurant.restaurantId);
  const toggleFavorite = (e) => {
    e.stopPropagation();

    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter(
        (item) => item !== restaurant.restaurantId,
      );
    } else {
      updatedFavorites = [...favorites, restaurant.restaurantId];
    }

    setFavorites(updatedFavorites);

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <Card
      hoverable
      className="premium-restaurant-card"
      cover={
        <div className="premium-image-wrapper">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="premium-restaurant-image"
          />

          <div className="restaurant-overlay-top">
            <Tag color="orange">50% OFF</Tag>

            <div
              className={
                isFavorite ? "favorite-btn active-favorite" : "favorite-btn"
              }
              onClick={toggleFavorite}
            >
              {isFavorite ? <HeartFilled /> : <HeartOutlined />}
            </div>
          </div>
        </div>
      }
      onClick={() => navigate(`/restaurant/${restaurant.restaurantId}`)}
    >
      <div className="premium-card-content">
        <div className="premium-card-header">
          <h2>{restaurant.name}</h2>

          <span className={restaurant.open ? "open-tag" : "closed-tag"}>
            {restaurant.open != false ? "Open" : "Closed"}
          </span>
        </div>

        <p>{restaurant.cuisine}</p>

        <Rate disabled allowHalf defaultValue={restaurant.rating} />

        <div className="premium-meta-row">
          <span>
            <ClockCircleOutlined /> {restaurant.deliveryTime}
          </span>

          <span>
            <EnvironmentOutlined /> {restaurant.location}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default RestaurantCard;
