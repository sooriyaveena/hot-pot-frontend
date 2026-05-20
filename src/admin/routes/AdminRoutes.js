import React from "react";

import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Restaurant from "../pages/Restaurant";
import Categories from "../pages/Categories";
import Orders from "../pages/Orders";
import MenuItem from "../pages/MenuItem";
import DeliveryPerson from "../pages/DeliveryPerson";
import Settings from "../pages/Profile";
import Profile from "../pages/Profile";

function AdminRoutes() {

  const role = localStorage.getItem("role");

  if (role !== "ADMIN") {
    return <Navigate to="/login" />;
  }

  return (

    <Routes>

      <Route path="/"element={<Dashboard />} />
      <Route path="dashboard"element={<Dashboard />}/>
      <Route path="users" element={<Users />} />
      <Route path="restaurants"element={<Restaurant />} />
      <Route path="categories" element={<Categories />}/>
      <Route path="orders" element={<Orders />} />
      <Route path="menuitems" element={<MenuItem />} />
      <Route path="deliveryperson" element={<DeliveryPerson />} />
       <Route path="profile" element={<Profile/>} />

    </Routes>

  );
}

export default AdminRoutes;