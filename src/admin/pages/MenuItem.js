import React, { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Adminnavbar from "../components/Adminnavbar";

import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Table,
  Tag,
  Space,
  message,
} from "antd";

import {
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import "../styles/MenuItem.css";

const { Option } = Select;
const { TextArea } = Input;

function MenuItem() {

  const [menuItems, setMenuItems] =
    useState([]);

  const [filteredItems, setFilteredItems] =
    useState([]);

  const [restaurants, setRestaurants] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [searchText, setSearchText] =
    useState("");

  const [itemName, setItemName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [dietaryType, setDietaryType] =
    useState("Veg");

  const [availabilityStatus,
    setAvailabilityStatus] =
    useState("Available");

  const [timing, setTiming] =
    useState("");

  

  const [selectedRestaurant,
    setSelectedRestaurant] =
    useState();

  const [selectedCategory,
    setSelectedCategory] =
    useState();

  useEffect(() => {

    loadData();

  }, []);

  useEffect(() => {

    const filtered =
      menuItems.filter((item) =>
        item.item
          .toLowerCase()
          .includes(
            searchText.toLowerCase()
          )
      );

    setFilteredItems(filtered);

  }, [searchText, menuItems]);

  const loadData = async () => {

    await fetchRestaurants();

    await fetchCategories();

    await fetchMenuItems();

  };

  const fetchMenuItems = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/menu/all",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data =
        await response.json();

      const menuData =
        Array.isArray(data)
          ? data
          : data.data || [];
const formattedItems =
  menuData.map((item) => ({

    key: item.itemId,

    item: item.name,

    restaurant:
      item.restaurant?.name,

    category:
      item.category?.name,

    price: `₹${item.price}`,

    dietaryType:
      item.dietaryType,

    availabilityStatus:
      item.availabilityStatus,

    timing:
      item.timing,

  }));

      setMenuItems(formattedItems);

      setFilteredItems(formattedItems);

    } catch (error) {

      console.log(error);

      message.error(
        "Failed To Fetch Menu Items"
      );
    }
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
              `Bearer ${token}`
          }
        }
      );

      const data =
        await response.json();

      const restaurantData =
        Array.isArray(data)
          ? data
          : data.data || [];

      setRestaurants(restaurantData);

    } catch (error) {

      console.log(error);

      message.error(
        "Failed To Fetch Restaurants"
      );
    }
  };

  const fetchCategories = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/category/all",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data =
        await response.json();

      const categoryData =
        Array.isArray(data)
          ? data
          : data.data || [];

      setCategories(categoryData);

    } catch (error) {

      console.log(error);

      message.error(
        "Failed To Fetch Categories"
      );
    }
  };

  const deleteMenuItem = async (id) => {

    try {

      const token =
        localStorage.getItem("token");

      await fetch(
        `http://localhost:8080/menu/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      message.success(
        "Menu Item Deleted Successfully"
      );

      loadData();

    } catch (error) {

      console.log(error);

      message.error(
        "Delete Failed"
      );
    }
  };

  const saveMenuItem = async () => {

    try {

      const token =
        localStorage.getItem("token");

      await fetch(
        "http://localhost:8080/menu/save",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({

            name: itemName,

            description: description,

            price: parseFloat(price),

            dietaryType:
              dietaryType,

            availabilityStatus:
              availabilityStatus,

            timing: timing,

            

            restaurant: {
              restaurantId:
                selectedRestaurant
            },

            category: {
              categoryId:
                selectedCategory
            }

          })

        }
      );

      message.success(
        "Menu Item Added Successfully"
      );

      loadData();

      setItemName("");

      setDescription("");

      setPrice("");

      setDietaryType("Veg");

      setAvailabilityStatus(
        "Available"
      );

      setTiming("");

     

      setSelectedRestaurant(
        undefined
      );

      setSelectedCategory(
        undefined
      );

    } catch (error) {

      console.log(error);

      message.error(
        "Server Error"
      );
    }
  };

  const columns = [

    {
      title: "ITEM",

      dataIndex: "item",

      render: (_, record) => (

        <div className="menu-item-info">

        

          <div>

            <h4>{record.item}</h4>

            <p>{record.timing}</p>

          </div>

        </div>

      ),
    },

    {
      title: "RESTAURANT",
      dataIndex: "restaurant",
    },

    
    {
      title: "PRICE",
      dataIndex: "price",
    },

    {
      title: "DIETARY",

      dataIndex: "dietaryType",

      render: (text) => (

        <Tag
          color={
            text === "Veg"
              ? "green"
              : "red"
          }
        >
          {text}
        </Tag>

      ),
    },

    {
      title: "AVAILABILITY",

      dataIndex:
        "availabilityStatus",

      render: (text) => (

        <Tag
          color={
            text === "Available"
              ? "green"
              : "orange"
          }
        >
          {text}
        </Tag>

      ),
    },

    {
      title: "ACTION",

      render: (_, record) => (

        <Space>

          <Button
            danger
            size="small"

            onClick={() =>
              deleteMenuItem(record.key)
            }
          >
            Delete
          </Button>

        </Space>

      ),
    },

  ];

  return (

    <div className="menu-page">

      <Sidebar />

      <div className="menu-main">

        <Adminnavbar />

        <div className="menu-content">

          <div className="menu-header">

            <div>

              <p className="manage-text">
                MANAGE
              </p>

              <h1 className="menu-title">
                MENU ITEMS
              </h1>

              <p className="menu-subtitle">
                Add, edit or remove menu
                items across restaurants
              </p>

            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="add-menu-btn"
            >
              Add Menu Item
            </Button>

          </div>

          <Card className="menu-form-card">

            <div className="form-title">
              🍜 Add Menu Item
            </div>

            <Row gutter={[20, 20]}>

              <Col xs={24} md={12}>

                <label>
                  Item Name
                </label>

                <Input
                  placeholder="Ex: Pizza"
                  value={itemName}
                  onChange={(e) =>
                    setItemName(
                      e.target.value
                    )
                  }
                />

              </Col>

              <Col xs={24} md={12}>

                <label>
                  Restaurant
                </label>

                <Select
                  placeholder="Select Restaurant"
                  value={selectedRestaurant}
                  onChange={(value) =>
                    setSelectedRestaurant(
                      value
                    )
                  }
                >

                  {
                    restaurants.map(
                      (restaurant) => (

                        <Option
                          key={
                            restaurant.restaurantId
                          }
                          value={
                            restaurant.restaurantId
                          }
                        >
                          {restaurant.name}
                        </Option>

                      )
                    )
                  }

                </Select>

              </Col>

              <Col span={24}>

                <label>
                  Description
                </label>

                <TextArea
                  rows={4}
                  placeholder="Description"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                />

              </Col>

              <Col xs={24} md={12}>

                <label>
                  Category
                </label>

                <Select
                  placeholder="Select Category"
                  value={selectedCategory}
                  onChange={(value) =>
                    setSelectedCategory(
                      value
                    )
                  }
                >

                  {
                    categories.map(
                      (category) => (

                        <Option
                          key={
                            category.categoryId
                          }
                          value={
                            category.categoryId
                          }
                        >
                          {category.name}
                        </Option>

                      )
                    )
                  }

                </Select>

              </Col>

              <Col xs={24} md={12}>

                <label>
                  Price
                </label>

                <Input
                  placeholder="₹300"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value
                    )
                  }
                />

              </Col>

              <Col xs={24} md={12}>

                <label>
                  Dietary Type
                </label>

                <Select
                  value={dietaryType}
                  onChange={
                    setDietaryType
                  }
                >

                  <Option value="Veg">
                    Veg
                  </Option>

                  <Option value="Non-Veg">
                    Non-Veg
                  </Option>

                </Select>

              </Col>

              <Col xs={24} md={12}>

                <label>
                  Availability
                </label>

                <Select
                  value={
                    availabilityStatus
                  }
                  onChange={
                    setAvailabilityStatus
                  }
                >

                  <Option value="Available">
                    Available
                  </Option>

                  <Option value="Out Of Stock">
                    Out Of Stock
                  </Option>

                </Select>

              </Col>

              <Col xs={24} md={12}>

                <label>
                  Timing
                </label>

                <Input
                  placeholder="Ex: 10 AM - 11 PM"
                  value={timing}
                  onChange={(e) =>
                    setTiming(
                      e.target.value
                    )
                  }
                />


               

               

              </Col>

              <Col span={24}>

                <Space>

                  <Button
                    type="primary"
                    className="save-btn"
                    onClick={saveMenuItem}
                  >
                    Save Item
                  </Button>

                  <Button>
                    Cancel
                  </Button>

                </Space>

              </Col>

            </Row>

          </Card>

          <Card className="menu-table-card">

            <div className="table-filter">

              <Input
                prefix={
                  <SearchOutlined />
                }
                placeholder="Search menu items"
                className="table-search"
                value={searchText}
                onChange={(e) =>
                  setSearchText(
                    e.target.value
                  )
                }
              />

            </div>

            <Table
              columns={columns}
              dataSource={filteredItems}
              scroll={{ x: 1200 }}
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                pageSizeOptions: [
                  "5",
                  "10",
                  "15",
                  "20"
                ],
              }}
            />

          </Card>

        </div>

      </div>

    </div>

  );
}

export default MenuItem;