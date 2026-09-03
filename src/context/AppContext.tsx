"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  slug?: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "error" | "warning";
}

interface AppContextType {
  cart: CartItem[];
  wishlist: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toasts: Toast[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string, color: string, size: string) => void;
  updateQuantity: (id: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  addToast: (message: string, type?: "success" | "info" | "error" | "warning") => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart and wishlist from localStorage on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("ditvi_cart");
      const savedWishlist = localStorage.getItem("ditvi_wishlist");
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.error("Failed to restore cart/wishlist state", e);
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("ditvi_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart state", e);
    }
  }, [cart, isHydrated]);

  // Save wishlist to localStorage whenever it changes (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("ditvi_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist state", e);
    }
  }, [wishlist, isHydrated]);

  const addToast = (message: string, type: "success" | "info" | "error" | "warning" = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.id === item.id && i.color === item.color && i.size === item.size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        addToast(`Updated ${item.name} quantity in Cart!`, "success");
        return updated;
      } else {
        addToast(`Added ${item.name} to Cart!`, "success");
        return [...prev, { ...item, quantity }];
      }
    });
  };

  const removeFromCart = (id: string, color: string, size: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id && i.color === color && i.size === size);
      if (item) {
        addToast(`Removed ${item.name} from Cart`, "info");
      }
      return prev.filter((i) => !(i.id === id && i.color === color && i.size === size));
    });
  };

  const updateQuantity = (id: string, color: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, color, size);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.id === id && i.color === color && i.size === size ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const isAlreadyIn = prev.includes(productId);
      if (isAlreadyIn) {
        addToast("Removed from Wishlist", "info");
        return prev.filter((id) => id !== productId);
      } else {
        addToast("Added to Wishlist!", "success");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        searchQuery,
        setSearchQuery,
        toasts,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
