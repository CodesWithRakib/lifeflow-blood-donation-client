import React, { useState, useEffect, useCallback } from "react";
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

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const axiosSecure = useAxios();

  const fetchUserRole = useCallback(
    async (email) => {
      if (!email) return null;

      setRoleLoading(true);
      try {
        const { data } = await axiosSecure.get("/user");
        setRole(data?.data?.role || null);
        return data?.data?.role;
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole(null);
        return null;
      } finally {
        setRoleLoading(false);
      }
    },
    [axiosSecure]
  );

  const handleAuthChange = useCallback(
    async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          // 1. First get JWT token
          const { data: tokenData } = await axiosSecure.post("/jwt", {
            email: currentUser.email,
          });

          if (tokenData?.token) {
            // 2. Then fetch user role
            await fetchUserRole(currentUser.email);
          }
        } catch (error) {
          console.error("Auth state change error:", error);
          setRole(null);
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    },
    [axiosSecure, fetchUserRole]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleAuthChange);
    return () => unsubscribe();
  }, [handleAuthChange]);

  const logIn = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await handleAuthChange(userCredential.user);
      return userCredential;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      await axiosSecure.post("/logout");
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
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

  const authData = {
    user,
    setUser,
    loading,
    logIn,
    logOut,
    createUser,
    updateUser,
    resetPassword,
    userRole: role,
    roleLoading,
    refetchRole: () => user?.email && fetchUserRole(user.email),
  };

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
