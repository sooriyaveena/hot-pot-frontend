import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function CategorySection() {
  const [selected, setSelected] = useState("All");
  const navigate = useNavigate();
  const categories = [
    {
      name: "All",

      image: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
    },

    {
      name: "Pizza",

      image: "https://cdn-icons-png.flaticon.com/512/6978/6978255.png",
    },

    {
      name: "Burger",

      image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    },

    {
      name: "Noodles",

      image: "https://cdn-icons-png.flaticon.com/512/2515/2515183.png",
    },

    {
      name: "Biryani",

      image:
        "data:image/png;base64,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",
    },

    {
      name: "Healthy",

      image: "https://cdn-icons-png.flaticon.com/512/415/415733.png",
    },

    {
      name: "Sushi",

      image:
        "data:image/png;base64,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",
    },

    {
      name: "Sandwich",

      image: "https://cdn-icons-png.flaticon.com/512/878/878052.png",
    },

    {
      name: "Desserts",

      image: "https://cdn-icons-png.flaticon.com/512/992/992754.png",
    },
  ];

  return (
    <div className="category-section">
      <h2>Browse by Category</h2>

      <div className="category-list">
        {categories.map((item) => (
          <div
            key={item.name}
            className={
              selected === item.name
                ? "category-card active-category"
                : "category-card"
            }
            onClick={() => {
              setSelected(item.name);

              navigate(`/restaurant?category=${item.name}`);
            }}
          >
            <div className="category-image">
              <img src={item.image} alt={item.name} />
            </div>

            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategorySection;
