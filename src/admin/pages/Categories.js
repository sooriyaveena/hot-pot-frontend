import React, { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Adminnavbar from "../components/Adminnavbar";

import "../styles/Categories.css";

import pizza from "../assets/pizza.jpg";
import burger from "../assets/burger.jpg";
import dessert from "../assets/dessert.jpg";
import biriyani from "../assets/biriyani.jpg";
import noodle from "../assets/noodle.jpg";

import {
  Button,
  Input,
  Row,
  Col,
  Select,
  Table,
  Tag,
  Modal,
  message,
} from "antd";

function Categories() {

  const [category, setCategory] = useState("");

  const [timing, setTiming] = useState("");

  const [description, setDescription] = useState("");

  const [open, setOpen] = useState(false);

  const [data, setData] = useState([]);

  const [restaurants, setRestaurants] = useState([]);

  const [selectedRestaurantId,setSelectedRestaurantId] = useState("");

  const [selectedPreview,setSelectedPreview] =useState("All");

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    const restaurantData =
      await fetchRestaurants();

    await fetchCategories(
      restaurantData
    );

  };

  const fetchRestaurants = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/restaurant/all",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const result =
        await response.json();

      if (result.success) {

        setRestaurants(result.data);

        return result.data;
      }

    } catch (error) {

      console.log(error);
    }
  };

  const fetchCategories = async (
    restaurantData
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/category/all",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const result =
        await response.json();

      if (result.success) {

        const formattedData =
          result.data.map((item) => ({

            key: item.categoryId,

            icon: "🍽️",

            category: item.name,

            restaurant:
              restaurantData.find(
                (r) =>
                  r.restaurantId ===
                  item.restaurant?.restaurantId
              )?.name || "No Restaurant",

            timing: "All Day",

            status: "Active",
          }));

        setData(formattedData);
      }

    } catch (error) {

      console.log(error);
    }
  };

  const addCategory = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/category/save",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: category,

            restaurant: {
              restaurantId:
                selectedRestaurantId,
            },
          }),
        }
      );

      const result =
        await response.json();

      if (result.success) {

        message.success(
          "Category Added Successfully"
        );

        loadData();

        setCategory("");

        setSelectedRestaurantId("");

        setTiming("");

        setDescription("");

        setOpen(false);
      }

    } catch (error) {

      console.log(error);

      message.error(
        "Failed To Add Category"
      );
    }
  };

  const deleteCategory = async (id) => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/category/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {

        throw new Error(
          "Delete Failed"
        );
      }

      const result =
        await response.json();

      if (result.success) {

        message.success(
          "Category Deleted"
        );

        loadData();
      }

    } catch (error) {

      console.log(error);

      message.error(
        "Unable To Delete Category"
      );
    }
  };

  const categoryImages = {

    Pizza: pizza,

    Burger: burger,

    Dessert: dessert,

    Indian: biriyani,

    Chinese: noodle,

    Arabian:
      "https://images.unsplash.com/photo-1544025162-d76694265947",

    Japanese:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",

    Barbecue:
      "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd",

    "Healthy Food":
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
  };

  const previewCategories = [
    "Pizza",
    "Burger",
    "Dessert",
    "Indian",
    "Chinese",
    "Arabian",
    "Japanese",
    "Barbecue",
    "Healthy Food",
  ].filter((category) =>
    data.some(
      (item) => item.category === category
    )
  );

  const filteredData =
    selectedPreview === "All"
      ? data
      : data.filter(
          (item) =>
            item.category ===
            selectedPreview
        );

  const columns = [

    {
      title: "ICON",
      dataIndex: "icon",
      key: "icon",
    },

    {
      title: "CATEGORY",
      dataIndex: "category",
      key: "category",
    },

    {
      title: "RESTAURANT",
      dataIndex: "restaurant",
      key: "restaurant",
    },

    {
      title: "TIMING",
      dataIndex: "timing",
      key: "timing",
    },

    {
      title: "STATUS",

      dataIndex: "status",

      render: (status) => (
        <Tag
          color={
            status === "Active"
              ? "green"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },

    {
      title: "ACTION",

      render: (_, record) => (
        <Button
          danger
          size="small"
          onClick={() =>
            deleteCategory(record.key)
          }
        >
          Delete
        </Button>
      ),
    },
  ];

  return (

    <div className="categories-page">

      <Sidebar />

      <div className="categories-main">

        <Adminnavbar />

        <div className="categories-content">

          <div className="categories-header">

            <div>

              <p className="manage-text">
                MANAGE
              </p>

              <h1 className="categories-title">
                CATEGORIES
              </h1>

              <p className="categories-subtitle">
                Menu categories per restaurant
              </p>

            </div>

            <Button
              type="primary"
              className="submit-btn"
              onClick={() => setOpen(true)}
            >
              + Add Category
            </Button>

          </div>

          <Modal
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            centered
            width={500}
          >

            <h2 className="modal-title">
              Add Category
            </h2>

            <Input
              className="category-input"
              placeholder="Enter category"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
            />

            <Select
              className="category-input"
              placeholder="Select Restaurant"
              value={selectedRestaurantId}
              onChange={(value) =>
                setSelectedRestaurantId(
                  value
                )
              }
              style={{
                width: "100%",
              }}
            >

              {restaurants.map(
                (restaurant) => (

                  <Select.Option
                    key={
                      restaurant.restaurantId
                    }
                    value={
                      restaurant.restaurantId
                    }
                  >
                    {restaurant.name}
                  </Select.Option>

                )
              )}

            </Select>

            <Input
              className="category-input"
              placeholder="Enter timing"
              value={timing}
              onChange={(e) =>
                setTiming(
                  e.target.value
                )
              }
            />

            <Input.TextArea
              rows={4}
              className="category-input"
              placeholder="Enter description"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />

            <Button
              type="primary"
              className="save-btn"
              onClick={addCategory}
            >
              Save Category
            </Button>

          </Modal>

          <h2 className="preview-heading">
            Category Preview
          </h2>

          <Row gutter={[20, 20]}>

            {previewCategories.map((item) => (

              <Col
                xs={24}
                sm={12}
                md={8}
                key={item}
              >

                <div
                  className={
                    selectedPreview === item
                      ? "food-image-card active-food-card"
                      : "food-image-card"
                  }
                  onClick={() =>
                    setSelectedPreview(item)
                  }
                >

                  <img
                    src={categoryImages[item]}
                    alt={item}
                    className="food-preview-image"
                  />

                  <div className="food-overlay">

                    <h3>{item}</h3>

                    <p>
                      Explore {item} Specials
                    </p>

                  </div>

                </div>

              </Col>

            ))}

          </Row>

          <div className="table-section">

            <h1 className="table-title">
              CATEGORY MANAGEMENT TABLE
            </h1>

            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{
                pageSize: 5,
              }}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

export default Categories;