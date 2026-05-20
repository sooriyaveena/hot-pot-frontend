import React, { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import { useNavigate } from "react-router-dom";

import { Carousel } from "antd";

import "../styles/home.css";

import axiosInstance from "../utils/axiosInstance";

function Home() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const isLoggedIn = !!localStorage.getItem("token");

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axiosInstance

      .get("/restaurant/all")

      .then((res) => {
        console.log(res.data);

        setRestaurants(res.data.data || []);
      })

      .catch((err) => {
        console.log(err);

        setRestaurants([]);
      });
  }, []);

  const categories = [
    {
      name: "Pizza",

      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    },

    {
      name: "Burger",

      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    },

    {
      name: "Biryani",

      image: "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd",
    },

    {
      name: "Desserts",

      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
    },
  ];

  return (
    <div className="home-page">
      <Navbar />

      <div className="search-section">
        <input
          type="text"
          placeholder="Search restaurants or dishes..."
          className="search-input"
        />

        <button className="search-btn">Search</button>
      </div>

      <section className="hero-section">
        <div className="hero-left">
          <p className="hero-tag">FAST DELIVERY • BEST RESTAURANTS</p>

          <h1 className="hero-title">
            Order Your
            <span> Favorite Food </span>
            Anytime.
          </h1>

          <p className="hero-subtitle">
            Discover trending restaurants, delicious meals and quick delivery
            right at your doorstep with HotPot.
          </p>

          <div className="hero-buttons">
            <button
              className="order-btn"
              onClick={() => {
                if (isLoggedIn) {
                  navigate("/restaurant");
                } else {
                  navigate("/login");
                }
              }}
            >
              Order Now
            </button>

            <button
              className="menu-btn"
              onClick={() => navigate("/restaurant")}
            >
              Explore Menu
            </button>
          </div>
        </div>

        <div className="hero-right">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            alt="Food"
            className="hero-image"
          />
        </div>
      </section>

      <div className="offers-wrapper">
        <Carousel autoplay dots={false} className="offers-carousel">
          <div>
            <div className="offer-slide orange-slide">
              <h2>🔥 Flat 50% OFF</h2>

              <p>On your first order above ₹499</p>
            </div>
          </div>

          <div>
            <div className="offer-slide red-slide">
              <h2>🚚 Free Delivery</h2>

              <p>On all restaurants this weekend</p>
            </div>
          </div>

          <div>
            <div className="offer-slide dark-slide">
              <h2>🍕 Buy 1 Get 1 Free</h2>

              <p>Available on selected pizza stores</p>
            </div>
          </div>
        </Carousel>
      </div>

      <section className="section">
        <div className="section-top">
          <div>
            <p className="section-tag">CATEGORIES</p>

            <h2 className="section-title">Popular Foods</h2>
          </div>
        </div>

        <div className="category-grid">
          {categories.map((item, index) => (
            <div className="category-card" key={index}>
              <img
                src={item.image}
                alt={item.name}
                className="category-image"
              />

              <div className="category-content">
                <h3 className="category-name">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {user && (
        <section className="section">
          <div className="section-top">
            <div>
              <p className="section-tag">FAVORITES</p>

              <h2 className="section-title">Your Favorites ❤️</h2>
            </div>
          </div>

          <div className="restaurant-grid">
            {restaurants.slice(0, 2).map((item) => (
              <div className="restaurant-card" key={item.restaurantId}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="restaurant-image"
                />

                <div className="restaurant-content">
                  <h3 className="restaurant-name">{item.name}</h3>

                  <p className="restaurant-cuisine">{item.cuisine}</p>

                  <div className="restaurant-rating">⭐ {item.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-top">
          <div>
            <p className="section-tag">RESTAURANTS</p>

            <h2 className="section-title">Top Rated Places</h2>
          </div>
        </div>

        <div className="restaurant-grid">
          {restaurants.map((item) => (
            <div className="restaurant-card" key={item.restaurantId}>
              <img
                src={item.image}
                alt={item.name}
                className="restaurant-image"
              />

              <div className="restaurant-content">
                <h3 className="restaurant-name">{item.name}</h3>

                <p className="restaurant-cuisine">{item.cuisine}</p>

                <div className="restaurant-rating">⭐ {item.rating}</div>

                <button
                  className="view-btn"
                  onClick={() => {
                    if (isLoggedIn) {
                      navigate(`/restaurant/${item.restaurantId}`);
                    } else {
                      navigate("/login");
                    }
                  }}
                >
                  View Menu
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <p className="section-tag">ABOUT US</p>

        <h2 className="about-title">Delivering Happiness Through Food.</h2>

        <p className="about-text">
          HotPot connects food lovers with the best restaurants in the city.
          From spicy hot pots to delicious desserts, we bring quality meals
          directly to your doorstep with fast and reliable delivery.
        </p>

        <div className="mini-footer">
          <span>HotPot 🍲</span>

          <span>© 2026</span>
        </div>
      </section>
    </div>
  );
}

export default Home;
