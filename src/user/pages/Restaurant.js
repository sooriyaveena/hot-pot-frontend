import React, { useEffect, useState } from "react";

import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import RestaurantCard from "../components/RestaurantCard";

import { useNavigate, useLocation } from "react-router-dom";

import "../styles/restaurant.css";

function Restaurant() {

  const navigate = useNavigate();

  const location = useLocation();

  const queryParams =
    new URLSearchParams(location.search);

  const [restaurants, setRestaurants] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const categoryFromURL =
    queryParams.get("category");

  const [selectedCategory, setSelectedCategory] =
    useState(categoryFromURL || "All");

  useEffect(() => {

    axiosInstance

      .get("/restaurant/all")

      .then((res) => {

        setRestaurants(

          Array.isArray(res.data.data)

            ? res.data.data

            : []

        );

      })

      .catch((err) => {

        console.log(err);

      });

  }, []);

  const categories = [

    "All",

    "Pizza",

    "Burger",

    "Chinese",

    "Dessert",

    "Indian",

    "Arabian",

    "North Indian",

    "Japanese",

    "Barbecue",

    "Healthy Food",

  ];

  const filteredRestaurants =
    restaurants.filter((item) => {

      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =

        selectedCategory === "All"

          ? true

          : item.cuisine
              .toLowerCase()
              .includes(
                selectedCategory.toLowerCase()
              );

      return (
        matchesSearch &&
        matchesCategory
      );

    });

  return (

    <div className="restaurant-page">

      <Navbar />

      <div className="restaurant-top-bar">

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >

          ← Back

        </button>

        <div className="restaurant-search compact-search">

          <div className="restaurant-search-wrapper">

            <span className="restaurant-search-icon">

              🔍

            </span>

            <input

              type="text"

              placeholder="Search restaurants..."

              value={search}

              onChange={(e) =>
                setSearch(e.target.value)
              }

            />

          </div>

        </div>

      </div>

      <div className="restaurant-container">

        <div className="restaurant-hero-banner">

          <div className="restaurant-hero-left">

            <span className="hero-badge">

              🍴 Discover Great Food

            </span>

            <h1>

              Find The Best Restaurants Near You

            </h1>

            <p>

              Explore top-rated restaurants,
              fast delivery, and delicious meals
              curated just for you.

            </p>

          </div>

          <div className="restaurant-hero-right">

            <img
              src="https://cdn-icons-png.flaticon.com/512/5787/5787016.png"
              alt="Food"
            />

          </div>

        </div>

        <div className="food-categories">

          {categories.map((item) => (

            <div

              key={item}

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

        <div className="restaurant-grid">

          {filteredRestaurants.map((item) => (

            <RestaurantCard
              key={item.restaurantId}
              restaurant={item}
            />

          ))}

        </div>

      </div>

    </div>

  );

}

export default Restaurant;