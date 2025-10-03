// CartContext.jsx
import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const LOCAL_KEY = "guest_cart";

const resolveProductId = (itemOrId) => {
  if (itemOrId == null) return null;
  if (typeof itemOrId === "string" || typeof itemOrId === "number") return String(itemOrId);
  return (
    (itemOrId.productId ??
      itemOrId.product?.id ??
      itemOrId.id ??
      itemOrId.product_id) != null
      ? String(
          itemOrId.productId ??
            itemOrId.product?.id ??
            itemOrId.id ??
            itemOrId.product_id
        )
      : null
  );
};

export const CartProvider = ({ children }) => {
  const { api, token, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(false);

  const mapCartItems = (items) =>
    items.map((item) => {
      const product = item.product ?? item;
      return {
        id: item.id ?? `guest-${product.id ?? Date.now()}`,
        productId: String(
          product.id ?? product.productId ?? product.product_id ?? ""
        ),
        name: product.title ?? product.name ?? "Unknown",
        price: String(product.price ?? "0"),
        quantity: item.quantity ?? 1,
        image: product.image_url ?? product.image ?? null,
      };
    });

  // fetch backend cart
  const fetchCart = async () => {
    if (!isAuthenticated || !token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get("https://uddy.onrender.com/details/cart/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.items ? mapCartItems(res.data.items) : []);
      localStorage.removeItem(LOCAL_KEY);
    } catch (err) {
      console.error("fetchCart error:", err?.response?.data ?? err.message);
      setError("Failed to fetch cart.");
    } finally {
      setIsLoading(false);
    }
  };

  
const updateQuantity = (id, quantity) => {
  setCart(prev =>
    prev.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    )
  );
};

  // add to cart
  const addToCart = async (itemOrId, qty = 1) => {
    setIsLoading(true);
    setError(null);
    const productId = resolveProductId(itemOrId);
    if (!productId) {
      setError("Invalid product.");
      setIsLoading(false);
      return;
    }
    try {
      if (isAuthenticated && token) {
        const res = await api.post(
          "https://uddy.onrender.com/details/cart/",
          { product_id: productId, quantity: qty },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart(res.data.items ? mapCartItems(res.data.items) : []);
      } else {
        // guest cart in localStorage
        setCart((prev) => {
          const exists = prev.find((p) => String(p.productId) === String(productId));
          if (exists) {
            return prev.map((p) =>
              String(p.productId) === String(productId)
                ? { ...p, quantity: p.quantity + qty }
                : p
            );
          }
          const normalized = mapCartItems([
            { ...(typeof itemOrId === "object" ? itemOrId : { id: productId }), quantity: qty },
          ])[0];
          return [...prev, normalized];
        });
      }
    } catch (err) {
      console.error("addToCart error:", err?.response?.data ?? err.message);
      setError("Failed to add to cart.");
    } finally {
      setIsLoading(false);
    }
  };

  // remove item
  const removeFromCart = async (itemOrId) => {
    setIsLoading(true);
    const productId = resolveProductId(itemOrId);
    if (!productId) return;
    try {
      if (isAuthenticated && token) {
        const res = await api.delete("https://uddy.onrender.com/details/cart/", {
          headers: { Authorization: `Bearer ${token}` },
          data: { product_id: productId },
        });
        setCart(res.data?.items ? mapCartItems(res.data.items) : []);
      } else {
        setCart((prev) => prev.filter((p) => String(p.productId) !== String(productId)));
      }
    } catch (err) {
      console.error("removeFromCart error:", err?.response?.data ?? err.message);
      setError("Failed to remove item.");
    } finally {
      setIsLoading(false);
    }
  };

  // clear
  const clearCart = async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated && token) {
        await api.delete("https://uddy.onrender.com/details/cart/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart([]);
      } else {
        setCart([]);
        localStorage.removeItem(LOCAL_KEY);
      }
    } catch (err) {
      console.error("clearCart error:", err?.response?.data ?? err.message);
      setError("Failed to clear cart.");
    } finally {
      setIsLoading(false);
    }
  };

  const cartTotal = cart.reduce(
    (acc, it) => acc + (parseFloat(it.price) || 0) * it.quantity,
    0
  );

  useEffect(() => {
    if (isAuthenticated && token && !mountedRef.current) {
      fetchCart();
      mountedRef.current = true;
    }
  }, [isAuthenticated, token]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        isLoading,
        updateQuantity,
        error,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
