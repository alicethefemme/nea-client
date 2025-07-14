import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "./theme/theme";

export default function LoginScreen() {
  // The main function for this code. This is the whole page.
  const router = useRouter(); // This is the expo router. This routes you from one page to the next.

  // Used to set the colours for the app.
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1, // Take full screen height.
      justifyContent: "center", // Centers vertically
      alignItems: "center", // Centers items horizontally,
      padding: 16,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 32,
      color: theme.textPrimary,
    },
    button: {
      minWidth: "30%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#9C27B0",
      borderRadius: 8,
      margin: 10,
    },
    buttonText: {
      fontSize: 24,
      color: theme.textPrimary,
    },
  });

  const redirectLogin = () => {
    router.push("./login");
  };

  const redirectRegister = () => {
    router.push("./register");
  };

  return (
    // This is the page being returned from the function.
    <View style={styles.container}>
      <Text style={styles.title}> Server Commander </Text>
      <TouchableOpacity style={styles.button} onPress={redirectLogin}>
        <Text style={styles.buttonText}> Login </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={redirectRegister}>
        <Text style={styles.buttonText}> Register</Text>
      </TouchableOpacity>
    </View>
  );
}
