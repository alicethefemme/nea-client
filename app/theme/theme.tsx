import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

const lightTheme = {
  background: "#ffffff",
  backgroundSemiTransparent: "#ffffff80",
  textPrimary: "#000",
  textSecondary: "#666666",
  errorText: "#D32F2F",
  primaryColor: "#9C27B0",
};

const darkTheme = {
  background: "#1E1E1E", //#1E1E1E
  backgroundSemiTransparent: "#1E1E1E80",
  textPrimary: "#fff",
  textSecondary: "#CCCCCC",
  errorText: "#EF5350",
  primaryColor: "#9C27B0",
};

const ThemeContext = createContext(lightTheme);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
