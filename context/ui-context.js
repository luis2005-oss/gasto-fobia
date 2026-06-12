"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UIContext = createContext();

export function UIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // CARGAR ESTADO
  useEffect(() => {
    const saved = localStorage.getItem("sidebar");

    if (saved !== null) {
      setSidebarOpen(saved === "true");
    }
  }, []);

  // GUARDAR ESTADO
  useEffect(() => {
    localStorage.setItem("sidebar", String(sidebarOpen));
  }, [sidebarOpen]);

  // TOGGLE
  function toggleSidebar() {
    setSidebarOpen((v) => !v);
  }

  return (
    <UIContext.Provider
      value={{
        sidebarOpen,

        toggleSidebar,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}
