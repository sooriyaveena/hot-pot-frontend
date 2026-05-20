import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";

import Restaurant from "../pages/Restaurant";
import CartPage from "../pages/CartPage";
import RestaurantDetailsPage from "../pages/RestaurantDetailsPage";

import LoginSelection from "../pages/LoginSelection";
import OrdersPage from "../pages/OrdersPage";
import PaymentPage from "../pages/PaymentPage";
import UserLogin from "../pages/UserLogin";

import Feedback from "../pages/Feedback";
import Profile from "../pages/Profile";
import AdminLogin from "../pages/AdminLogin";
import AdminRoutes from "../../admin/routes/AdminRoutes";
import UserSignup from "../pages/UserSignup";
function UserRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/restaurant" element={<Restaurant />} />

        <Route path="/restaurant/:id" element={<RestaurantDetailsPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/login" element={<LoginSelection />} />

        <Route path="/login/user" element={<UserLogin />} />

        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/feedback/:restaurantId/:orderId" element={<Feedback />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default UserRoutes;
