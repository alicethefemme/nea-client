import { Alert, BackHandler, Linking } from "react-native";

export default function errorAlert(message, errorMessage) {
  Alert.alert("Whoops! An error has occured...", message, [
    {
      text: "Email error",
      onPress: () =>
        Linking.openURL(
          `mailto:alicethefemme+errorreporting@atfdev.co.uk?subject=Error in Server Commander&body=${errorMessage}`
        ),
      style: "default",
    },
    {
      text: "Exit",
      onPress: () => BackHandler.exitApp(),
      style: "destructive",
    },
  ]);
}

export function softErrorAlert(message) {
  Alert.alert("Oh no! Something failed...", message, [
    {
      text: "Close",
      style: "cancel",
    },
  ]);
}
