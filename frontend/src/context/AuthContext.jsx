import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("footballTalentUser");
    const token = localStorage.getItem("footballTalentToken");

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("footballTalentUser");
        localStorage.removeItem("footballTalentToken");
      }
    }

    setLoading(false);
  }, []);

  const login = (userData, token) => {
    const normalizedUser = {
      role: userData.role || "player",
      ...userData
    };
    setUser(normalizedUser);
    localStorage.setItem("footballTalentUser", JSON.stringify(normalizedUser));
    localStorage.setItem("footballTalentToken", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("footballTalentUser");
    localStorage.removeItem("footballTalentToken");
  };

  const updateUser = (updatedData) => {
    setUser((currentUser) => {
      const nextUser = { ...currentUser, ...updatedData };
      localStorage.setItem("footballTalentUser", JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      updateUser
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
