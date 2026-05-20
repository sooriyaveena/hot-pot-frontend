import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { Rate, Button } from "antd";

import axiosInstance from "../utils/axiosInstance";

import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";

import Navbar from "../components/Navbar";

import FoodCard from "../components/FoodCard";

import "../styles/restaurantDetails.css";

function RestaurantDetailsPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);

  const [foods, setFoods] = useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const savedFavorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

  const [favorites, setFavorites] =
    useState(savedFavorites);

  useEffect(() => {

    fetchRestaurant();

    fetchFoods();

  }, [id]);

  const fetchRestaurant = async () => {

    try {

      const res =
        await axiosInstance.get("/restaurant/all");

      const foundRestaurant =
        res.data.data.find(
          (item) =>
            item.restaurantId === Number(id)
        );

      setRestaurant(foundRestaurant);

    } catch (err) {

      console.log(err);
    }
  };

  const fetchFoods = async () => {

    try {

      const res =
        await axiosInstance.get(
          `/menu/restaurant/${id}`
        );

      setFoods(res.data.data || []);

    } catch (err) {

      console.log(err);
    }
  };

  const isFavorite =
    favorites.includes(
      restaurant?.restaurantId
    );

  const toggleFavorite = () => {

    let updatedFavorites;

    if (isFavorite) {

      updatedFavorites =
        favorites.filter(
          (favId) =>
            favId !== restaurant.restaurantId
        );

    } else {

      updatedFavorites = [
        ...favorites,
        restaurant.restaurantId,
      ];
    }

    setFavorites(updatedFavorites);

    localStorage.setItem(
      "favorites",
      JSON.stringify(updatedFavorites)
    );
  };

  const categories = [

    "All",

    ...new Set(

      foods

        .filter(
          (item) => item.category?.name
        )

        .map(
          (item) => item.category.name
        )

    ),

  ];

  const filteredFoods = foods.filter(
    (item) =>

      selectedCategory === "All"

        ? true

        : item.category?.name ===
          selectedCategory
  );

  return (

    <div className="restaurant-details-page">

      <Navbar />

      <div
        className="back-btn"
        onClick={() =>
          navigate("/restaurant")
        }
      >

        <ArrowLeftOutlined />

        <span>Back</span>

      </div>

      <div className="restaurant-details-container">

        <div
          className="restaurant-hero"
          style={{
            backgroundImage: `url(${
              restaurant?.image ||
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            })`,
          }}
        >

          <div className="hero-overlay">

            <div className="hero-content">

              <div>

                <h1>
                  {restaurant?.name}
                </h1>

                <p>
                  {restaurant?.cuisine}
                </p>

                <div className="hero-meta">

                  <div className="hero-rating">

                    <Rate
                      disabled
                      allowHalf
                      defaultValue={
                        restaurant?.rating || 4
                      }
                    />

                    <span>
                      {restaurant?.rating}
                    </span>

                  </div>

                  <span>

                    <ClockCircleOutlined />

                    {" "}
                    {restaurant?.deliveryTime}

                  </span>

                  <span>

                    <EnvironmentOutlined />

                    {" "}
                    {restaurant?.location}

                  </span>

                </div>

              </div>

              <Button
                className="favorite-btn"
                onClick={toggleFavorite}
              >

                {isFavorite
                  ? <HeartFilled />
                  : <HeartOutlined />}

              </Button>

            </div>

          </div>

        </div>

        <div className="food-categories">

          {categories.map((item, index) => (

            <div
              key={`${item}-${index}`}
              className={
                selectedCategory === item
                  ? "food-pill active-pill"
                  : "food-pill"
              }

              onClick={() =>
                setSelectedCategory(item)
              }
            >

              {item}

            </div>

          ))}

        </div>

        <div className="food-grid">

          {filteredFoods.map((item) => (

            <FoodCard
              key={item.itemId}
              food={{
                ...item,

                restaurantName:
                  restaurant?.name,

                restaurantId:
                  restaurant?.restaurantId,
              }}
            />

          ))}

        </div>

      </div>

    </div>
  );
}

export default RestaurantDetailsPage;