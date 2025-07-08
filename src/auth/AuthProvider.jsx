import React from "react";
import { useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import useAxios from "../hooks/useAxios";
import { app } from "../firebase/firebase.config";
import { useEffect } from "react";

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = async () => {
    try {
      await signOut(auth);

      await axiosSecure.post("/logout");

      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUser = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const axiosSecure = useAxios();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          const response = await axiosSecure.post("/jwt", {
            email: currentUser.email,
          });
          // Suppose your backend returns token in response.data.token
          if (response.data?.token) {
            localStorage.setItem("accessToken", response.data.token);
          }
        } catch (error) {
          console.error("JWT issue:", error);
          localStorage.removeItem("accessToken");
        }
      } else {
        localStorage.removeItem("accessToken");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [axiosSecure]);

  const authData = {
    user,
    setUser,
    loading,
    logIn,
    logOut,
    createUser,
    updateUser,
    resetPassword,
  };
  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
