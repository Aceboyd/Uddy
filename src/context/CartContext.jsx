// CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { api, token, isAuthenticated } = useAuth();

  // ✅ Normalize items from backend or guest
  const mapCartItems = (items) =>
    items.map((item) => {
      const product = item.product || item; // backend gives {product}, guest gives raw product
      return {
        id: item.id || Date.now(), // unique id (backend cart item id or fallback)
        productId: product.id, // backend product id
        name: product.title || product.name || "Unknown",
        price: product.price?.toString() || "0",
        quantity: item.quantity || 1,
        image: product.image_url || product.image || null,
      };
    });

  // ✅ Fetch cart
  const fetchCart = async () => {
    if (!isAuthenticated || !token) {
      setCart([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/details/cart/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(
        response.data.items ? mapCartItems(response.data.items) : []
      );
    } catch (error) {
      console.error("Fetch cart error:", error.response?.data || error.message);
      setError("Failed to fetch cart. Please try again later.");
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Add item (works for guest + logged in)
  const addToCart = async (item) => {
    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        product_id: item.productId || item.id,
        quantity: 1,
      };

      if (isAuthenticated && token) {
        const res = await api.post(
          "/details/cart/add/",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart(
          res.data.items ? mapCartItems(res.data.items) : []
        );
      } else {
        // Guest mode → normalize using mapCartItems
        setCart((prev) => {
          const exists = prev.find(
            (p) => p.productId === payload.product_id
          );
          if (exists) {
            return prev.map((p) =>
              p.productId === payload.product_id
                ? { ...p, quantity: p.quantity + 1 }
                : p
            );
          }
          return [...prev, ...mapCartItems([{ ...item, quantity: 1 }])];
        });
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Update quantity
  const updateQuantity = async (item, quantity) => {
    if (!isAuthenticated || !token) {
      setError("Please log in to update cart.");
      return;
    }
    if (quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.patch(
        "/details/cart/",
        { product_id: item.productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(
        response.data.items ? mapCartItems(response.data.items) : []
      );
    } catch (error) {
      console.error("Update quantity error:", error.response?.data || error.message);
      setError("Failed to update quantity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Remove item
  const removeFromCart = async (item) => {
    if (!isAuthenticated || !token) {
      setError("Please log in to remove items.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.delete("/details/cart/", {
        headers: { Authorization: `Bearer ${token}` },
        data: { product_id: item.productId },
      });
      setCart(
        response.data.items ? mapCartItems(response.data.items) : []
      );
    } catch (error) {
      console.error("Remove from cart error:", error.response?.data || error.message);
      setError("Failed to remove item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Clear cart
  const clearCart = async () => {
    if (!isAuthenticated || !token) {
      setCart([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await api.delete("/details/cart/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart([]);
    } catch (error) {
      console.error("Clear cart error:", error.response?.data || error.message);
      setError("Failed to clear cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Total
  const cartTotal = cart.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    return total + price * item.quantity;
  }, 0);

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, token, api]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        error,
        isLoading,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
