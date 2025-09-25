import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { AccountAPI } from "../services/api";

export const useLogin = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const login = async (email, password) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await AccountAPI.login(email, password);

      // save the user to locale storage
      localStorage.setItem("user", JSON.stringify(response.data));

      // update the auth context
      dispatch({ type: "LOGIN", payload: response.data });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;
      setError(errorMessage);
      console.error("Error login: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  return { login, isLoading, error };
};
