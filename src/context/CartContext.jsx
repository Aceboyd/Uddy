// CartContext.jsx
import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const LOCAL_KEY = "guest_cart";

const resolveProductId = (itemOrId) => {
  if (itemOrId == null) return null;
  if (typeof itemOrId === "string" || typeof itemOrId === "number") return String(itemOrId);
  return (
    (itemOrId.productId ?? itemOrId.product?.id ?? itemOrId.id ?? itemOrId.product_id) != null
      ? String(itemOrId.productId ?? itemOrId.product?.id ?? itemOrId.id ?? itemOrId.product_id)
      : null
  );
};

export const CartProvider = ({ children }) => {
  const { api, token, isAuthenticated } = useAuth();
  const [cart, setCart] = useState(() => {
    // load from localStorage immediately so reload shows saved cart
    try {
      const stored = localStorage.getItem(LOCAL_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn("Failed to parse stored cart", e);
      localStorage.removeItem(LOCAL_KEY);
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(false);

  // normalizer: accepts backend cart items ({id, product: {...}, quantity}) or raw products
  const mapCartItems = (items) =>
    items.map((item) => {
      const product = item.product ?? item;
      return {
        id: item.id ?? `guest-${product.id ?? Date.now()}`,
        productId: String(product.id ?? product.productId ?? product.product_id ?? product.id ?? ""),
        name: product.title ?? product.name ?? "Unknown",
        price: String(product.price ?? "0"),
        quantity: item.quantity ?? product.quantity ?? 1,
        image: product.image_url ?? product.image ?? null,
      };
    });

  // Persist guest cart to localStorage on each change (only for guests)
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(cart));
      } catch (e) {
        console.warn("Failed to save cart to localStorage", e);
      }
    }
  }, [cart, isAuthenticated]);

  // When logged in, fetch backend cart. If a guest cart exists, optionally merge (below).
  const fetchCart = async () => {
    if (!isAuthenticated || !token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get("/details/cart/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.items ? mapCartItems(res.data.items) : []);
      // Remove guest cart after successful fetch/merge
      localStorage.removeItem(LOCAL_KEY);
    } catch (err) {
      console.error("fetchCart error:", err?.response?.data ?? err.message ?? err);
      setError("Failed to fetch cart.");
    } finally {
      setIsLoading(false);
    }
  };

  // Merge guest cart into backend (called automatically on login if guest cart exists)
  const mergeGuestCartToBackend = async (guestItems = []) => {
    if (!isAuthenticated || !token) return;
    if (!Array.isArray(guestItems) || guestItems.length === 0) {
      await fetchCart();
      return;
    }
    setIsLoading(true);
    try {
      // sequentially post each guest item to backend
      for (const g of guestItems) {
        const productId = resolveProductId(g);
        const quantity = g.quantity ?? 1;
        if (!productId) continue;
        try {
          await api.post(
            "/details/cart/",
            { product_id: productId, quantity },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (e) {
          console.warn("merge item failed", productId, e?.response?.data ?? e.message ?? e);
        }
      }
      // refresh backend cart and clear guest storage
      await fetchCart();
      localStorage.removeItem(LOCAL_KEY);
    } catch (e) {
      console.error("mergeGuestCartToBackend error", e);
    } finally {
      setIsLoading(false);
    }
  };

  // auto-run on login / auth change
  useEffect(() => {
    if (!mountedRef.current) mountedRef.current = true;
    if (isAuthenticated && token) {
      // if guest cart exists, merge
      try {
        const stored = localStorage.getItem(LOCAL_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            mergeGuestCartToBackend(parsed);
            return;
          }
        }
      } catch (e) {
        console.warn("failed reading guest cart during login", e);
        localStorage.removeItem(LOCAL_KEY);
      }
      // otherwise just fetch
      fetchCart();
    } else {
      // not authenticated: ensure cart state reflects localStorage (in case it changed)
      try {
        const stored = localStorage.getItem(LOCAL_KEY);
        setCart(stored ? JSON.parse(stored) : []);
      } catch (e) {
        console.warn("Failed to read guest cart", e);
        localStorage.removeItem(LOCAL_KEY);
        setCart([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  // addToCart accepts product object or productId
  const addToCart = async (itemOrId, qty = 1) => {
    setIsLoading(true);
    setError(null);
    const productId = resolveProductId(itemOrId);
    if (!productId) {
      setIsLoading(false);
      setError("Invalid product.");
      return;
    }
    try {
      if (isAuthenticated && token) {
        const res = await api.post(
          "/details/cart/",
          { product_id: productId, quantity: qty },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart(res.data.items ? mapCartItems(res.data.items) : []);
      } else {
        setCart((prev) => {
          const exists = prev.find((p) => String(p.productId) === String(productId));
          if (exists) {
            return prev.map((p) =>
              String(p.productId) === String(productId)
                ? { ...p, quantity: p.quantity + qty }
                : p
            );
          }
          // create normalized new item from whatever itemOrId was
          const normalized = mapCartItems([{ ...(typeof itemOrId === "object" ? itemOrId : { id: productId }), quantity: qty }])[0];
          return [...prev, normalized];
        });
      }
    } catch (err) {
      console.error("addToCart error:", err?.response?.data ?? err.message ?? err);
      setError("Failed to add to cart.");
    } finally {
      setIsLoading(false);
    }
  };

  // updateQuantity accepts item object or productId
  const updateQuantity = async (itemOrId, quantity) => {
    if (quantity < 1) return;
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
        const res = await api.patch(
          "/details/cart/",
          { product_id: productId, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart(res.data.items ? mapCartItems(res.data.items) : []);
      } else {
        setCart((prev) => prev.map((p) => (String(p.productId) === String(productId) ? { ...p, quantity } : p)));
      }
    } catch (err) {
      console.error("updateQuantity error:", err?.response?.data ?? err.message ?? err);
      setError("Failed to update quantity.");
    } finally {
      setIsLoading(false);
    }
  };

  // removeFromCart accepts item object or productId
  const removeFromCart = async (itemOrId) => {
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
        const res = await api.delete("/details/cart/", {
          headers: { Authorization: `Bearer ${token}` },
          data: { product_id: productId },
        });
        // handle 204 or 200 response with items
        if (res.status === 204) {
          setCart([]);
        } else if (res.data?.items) {
          setCart(mapCartItems(res.data.items));
        } else {
          // fallback
          await fetchCart();
        }
      } else {
        setCart((prev) => prev.filter((p) => String(p.productId) !== String(productId)));
      }
    } catch (err) {
      console.error("removeFromCart error:", err?.response?.data ?? err.message ?? err);
      setError("Failed to remove item.");
    } finally {
      setIsLoading(false);
    }
  };

  // clear cart
  const clearCart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isAuthenticated && token) {
        await api.delete("/details/cart/", { headers: { Authorization: `Bearer ${token}` } });
        setCart([]);
      } else {
        setCart([]);
        localStorage.removeItem(LOCAL_KEY);
      }
    } catch (err) {
      console.error("clearCart error:", err?.response?.data ?? err.message ?? err);
      setError("Failed to clear cart.");
    } finally {
      setIsLoading(false);
    }
  };

  const cartTotal = cart.reduce((acc, it) => acc + (parseFloat(it.price) || 0) * it.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        isLoading,
        error,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
