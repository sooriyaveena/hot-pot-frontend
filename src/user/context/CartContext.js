import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];

  const [cartItems, setCartItems] = useState(savedCart);



  useEffect(() => {
    localStorage.setItem(
      "cartItems",

      JSON.stringify(cartItems),
    );
  }, [cartItems]);



  const addToCart = (food) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) =>
          item.id === food.id && item.restaurantId === food.restaurantId,
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === food.id && item.restaurantId === food.restaurantId
            ? {
                ...item,

                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...prev,

        {
          ...food,

          quantity: 1,
        },
      ];
    });
  };



  const decreaseQuantity = (id, restaurantId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id && item.restaurantId === restaurantId
            ? {
                ...item,

                quantity: item.quantity - 1,
              }
            : item,
        )

        .filter((item) => item.quantity > 0),
    );
  };



  const removeFromCart = (id, restaurantId) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.restaurantId === restaurantId),
      ),
    );
  };


  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,

        addToCart,

        decreaseQuantity,

        removeFromCart,

        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
