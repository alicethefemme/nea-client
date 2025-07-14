import ServerStore from "@/helpers/serverConfigManager";
import { useRouter } from "expo-router";
import debounce from "lodash.debounce";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTheme } from "./theme/theme";

/**
 * This is the window for the Register Page. This lets the user register a server, save it to the device and connect to it.
 */
export default function RegisterScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      flex: 1,
      width: "100%",
      justifyContent: "center", // Centers items vertically
      alignItems: "center", // Centers items horizontally,
      padding: 16,
    },
    scrollContainer: {
      minHeight: "100%",
      justifyContent: "center", // Centers everything vertically
      backgroundColor: theme.background,
    },
    title: {
      color: theme.textPrimary,
      fontSize: 32,
      marginBottom: 32,
      fontWeight: "bold",
    },
    input: {
      width: "80%",
      height: 40,
      color: theme.textSecondary,
      borderColor: "#cccccc",
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 16,
      padding: 10,
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

  //TODO: Add name validation checking for existing items.

  // States for the input fields.
  const [nameEntry, setNameEntry] = useState("");
  const [ipEntry, setIpEntry] = useState("");
  const [portEntry, setPortEntry] = useState("");
  const [usernameEntry, setUsernameEntry] = useState("");
  const [passwordEntry, setPasswordEntry] = useState("");

  // Debounced validation for the name entry.
  const [nameEntryValid, setNameEntryValid] = useState(true);
  const [nameEntryChanged, setNameEntryChanged] = useState(false);
  const handleNameEntryChange = (value: string) => {
    if (!nameEntryChanged) setNameEntryChanged(true);
    setNameEntry(value);
    validateNameEntry(value);
  };
  const validateNameEntry = debounce((value: string) => {
    // Check for the uniqueness of name.

    setNameEntryValid(true);
  }, 500);

  // Debounced validation for the IP entry.
  const [ipEntryValid, setIpEntryValid] = useState(true);
  const [ipEntryChanged, setIpEntryChanged] = useState(false);
  const handleIpEntryChange = (value: string) => {
    if (!ipEntryChanged) setIpEntryChanged(true);
    setIpEntry(value);
    validateIpEntry(value);
  };
  const validateIpEntry = debounce((value: string) => {
    setIpEntryValid(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(value));
  }, 500);

  // Debounced validation for the port validation.
  // TODO: Fix validation for port entry.
  const [portEntryValid, setPortEntryValid] = useState(true);
  const [portEntryChanged, setPortEntryChanged] = useState(false);
  const handlePortEntryChange = (value: string) => {
    if (!portEntryChanged) setPortEntryChanged(true); // Changes after first touch.
    setPortEntry(value);
    validatePortEntry(value);
  };
  const validatePortEntry = debounce((value: string) => {
    if (value === "") {
      console.log("Tis empty");
      setPortEntryValid(false);
      return;
    }
    const nvalue = Number(value);
    if (Number.isNaN(nvalue)) {
      console.log("Tis not a number");
      setPortEntryValid(false);
      return;
    }
    if (!(nvalue >= 1 && nvalue <= 65535)) {
      console.log("Tis too big or smol");
      setPortEntryValid(false);
      return;
    }
    setPortEntryValid(true);
  }, 500);

  //TODO: Add a button to submit the information and begin connecting to the server, as well as saving the profile.
  const submitLogin = async () => {
    //TODO: Add connectivity check here for the server.

    // Create the object to add to the local store.
    const serverItem = {
      name: nameEntry,
      ip: ipEntry,
      port: portEntry,
      username: usernameEntry,
      password: passwordEntry,
    };

    // Add the item to the server storage string.
    await ServerStore.init();
    const works = await ServerStore.addServer(serverItem);
    console.log(serverItem);
    if (works) {
      // TODO: Change this to the submission screen. Needs to pass information through somehow?
      router.push("/login");
    } else {
      router.push("/");
    }
  };

  const [allValuesValid, setAllValuesValid] = useState(false);
  useEffect(() => {
    // Checking all of the premade
    if (!nameEntryValid) {
      setAllValuesValid(false);
      return;
    }
    if (!ipEntryValid) {
      setAllValuesValid(false);
      return;
    }
    if (!portEntryValid) {
      setAllValuesValid(false);
      return;
    }

    // Checking that all inputs are filled.
    if (nameEntry.length === 0) {
      setAllValuesValid(false);
      return;
    }
    if (ipEntry.length === 0) {
      setAllValuesValid(false);
      return;
    }
    if (portEntry.length === 0) {
      setAllValuesValid(false);
      return;
    }
    if (usernameEntry.length === 0) {
      setAllValuesValid(false);
      return;
    }
    if (passwordEntry.length === 0) {
      setAllValuesValid(false);
      return;
    }
  }, [nameEntry, ipEntry, portEntry, usernameEntry, passwordEntry]);

  return (
    // This is the page being returned from the function.
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={{
            backgroundColor: theme.background,
            flex: 1,
            width: "100%",
            flexGrow: 1,
          }}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignItems: "center", width: "100%" }}>
            <Text style={styles.title}> Registration </Text>
            <TextInput
              style={styles.input}
              placeholder="Name of server"
              placeholderTextColor={theme.textSecondary}
              value={nameEntry}
              onChangeText={setNameEntry}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="IP of server"
              placeholderTextColor={theme.textSecondary}
              value={ipEntry}
              onChangeText={handleIpEntryChange}
            ></TextInput>
            <Text
              style={{
                display: !ipEntryValid && ipEntryChanged ? "flex" : "none",
                color: theme.errorText,
              }}
            >
              Your IP address entry is invalid.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Port for server"
              placeholderTextColor={theme.textSecondary}
              value={portEntry}
              onChangeText={handlePortEntryChange}
            ></TextInput>
            <Text
              style={{
                display: !portEntryValid && portEntryChanged ? "flex" : "none",
                color: theme.errorText,
              }}
            >
              Your port entry is invalid.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Username for server"
              placeholderTextColor={theme.textSecondary}
              value={usernameEntry}
              onChangeText={setUsernameEntry}
            ></TextInput>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder="Password for server"
              placeholderTextColor={theme.textSecondary}
              value={passwordEntry}
              onChangeText={setPasswordEntry}
            ></TextInput>
            <TouchableOpacity
              style={[styles.button]}
              disabled={allValuesValid ? true : false}
              onPress={submitLogin}
            >
              <Text style={styles.buttonText}> Submit </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
