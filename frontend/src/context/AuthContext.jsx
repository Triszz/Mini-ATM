import { createContext, useReducer, useEffect } from "react";
/* eslint-disable react-refresh/only-export-components */

export const AuthContext = createContext();
export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload, isInitialized: true };
    case "LOGOUT":
      return { user: null, isInitialized: true };
    case "INITIALIZE":
      return { ...state, isInitialized: true };
    default:
      return state;
  }
};
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isInitialized: false,
  });
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const userString = localStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          if (user?.token) {
            dispatch({ type: "LOGIN", payload: user });
          } else {
            dispatch({ type: "INITIALIZE" });
          }
        } else {
          dispatch({ type: "INITIALIZE" });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("user");
        dispatch({ type: "INITIALIZE" });
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
