import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "./theme/theme";

export default function RootLayout() {

  const theme = useTheme();
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.background
          }
        }}>
        <Stack.Screen name='index' options={{ headerShown: false}}></Stack.Screen>
        <Stack.Screen name='register' options={{ headerShown: false}}></Stack.Screen>
      </Stack>
    </ThemeProvider>
  );
}
