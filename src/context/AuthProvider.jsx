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
import { useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import { useEffect } from "react";
import { app } from "../firebase/firebase.config";

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxios();

  // Using TanStack Query only for fetching user role
  const {
    data: userRole,
    refetch: refetchUserRole,
    isLoading: roleLoading,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get("/user");
        return data.data.role;
      } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
      }
    },
    enabled: !!user?.email, // Only fetch when user email exists
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          const { data } = await axiosSecure.post("/jwt", {
            email: currentUser.email,
          });

          if (data?.token) {
            // NEW: Wait until role exists (max 5 tries)
            let attempts = 0;
            let role = null;

            while (!role && attempts < 5) {
              try {
                const res = await axiosSecure.get("/user");
                role = res.data?.data?.role;
                if (role) break;
              } catch (err) {
                console.warn("Waiting for role to be created...");
              }

              attempts++;
              await new Promise((resolve) => setTimeout(resolve, 1000)); // wait 1 sec
            }

            await refetchUserRole(); // Now force update
          }
        } catch (error) {
          console.error("JWT or role fetch issue:", error);
        }
      }

      setLoading(false); // Move this here after role is fetched
    });

    return () => unsubscribe();
  }, [axiosSecure, refetchUserRole]);

  const authData = {
    user,
    setUser,
    loading,
    logIn,
    logOut,
    createUser,
    updateUser,
    resetPassword,
    userRole,
    roleLoading,
  };

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
