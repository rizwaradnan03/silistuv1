import React, { createContext, useReducer, useEffect } from "react";
import RNSInfo from "react-native-sensitive-info";
import * as SecureStore from "expo-secure-store";
import { ApiManager } from "../api/ApiManager";

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        exp: action.payload.exp,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext({});
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, {});

  const setUser = (user, token, exp) => {
    dispatch({
      type: "SET_USER",
      payload: { user: user, token: token, exp: exp },
    });
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("authInfo");
      setUser(null, "", null);
    } catch (error) {
      console.error("Error deleting authInfo:", error);
    }
    console.log("RNSInfo:", RNSInfo); // Pastikan ini bukan undefined
    console.log("deleteItem:", RNSInfo.deleteItem); // Pastikan ini bukan undefined
  };

  const login = async (username, password) => {
    try {
      const data = await ApiManager.post("/login", {
        username: username,
        password: password,
        clientType: "CUSTOMER",
        tenantID: "bpr_kn_dev",
      });

      await SecureStore.setItemAsync("authInfo", JSON.stringify(data.data));
      setUser(data.data.user, data.data.accessToken, data.exp);
      return data;
    } catch (error) {
      switch (error.response?.status) {
        case 401:
          throw "Username atau password salah";
        default:
          throw `Terjadi kesalahan saat login (code: ${error})`;
      }
    }
  };

  useEffect(() => {
    // Lakukan pengecekan waktu ekspirasi (exp) di sini
    const checkTokenExpiration = () => {
      const { exp, token } = state;
      const currentTime = Math.floor(Date.now() / 1000); // Waktu saat ini dalam detik
      if (exp && exp < currentTime) {
        logout();
        navigation.navigate("Login");
      }
    };

    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, 24 * 60 * 60);

    return () => clearInterval(interval);
  }, [state, logout]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        exp: state.exp,
        setUser,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
