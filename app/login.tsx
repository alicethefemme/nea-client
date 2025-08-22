import { softErrorAlert } from "@/helpers/errorManager";
import Server from "@/helpers/server";
import { default as ServerStore } from "@/helpers/serverConfigManager";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "./theme/theme";
/**
 * This is the window for the Login Page. This lets the user select a server, and connect to it.
 */
export default function LoginScreen() {
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    title: {
      color: theme.textPrimary,
      fontSize: 32,
      marginBottom: 32,
      fontWeight: "bold",
    },
    button: {
      minWidth: "30%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.primaryColor,
      borderRadius: 8,
      margin: 10,
    },
    buttonText: {
      fontSize: 24,
      color: theme.textPrimary,
    },
  });

  type ServerItem = {
    name: string;
    ip: string;
    port: number;
    username: string;
    password: string;
  };

  // TODO: Get the list of servers from the secure store.
  const [servers, setServers] = useState<ServerItem[]>([]);
  const [selectedServer, setSelectedServer] = useState<ServerItem>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      await ServerStore.init();
      const serverConfig = await ServerStore.getServers();
      await setServers(serverConfig);
    };
    loadData();
  }, []);

  // Styles to be used on the picker specifically.
  const pickerStyle = StyleSheet.create({
    container: {
      padding: 16,
      justifyContent: "center",
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: theme.textPrimary,
    },
    picker: {
      minHeight: 50,
      width: "100%",
      color: theme.textSecondary,
    },
  });

  // Styles to be used on the modal loading icon
  const modalStyle = StyleSheet.create({
    modalView: {
      display: "flex",
      alignContent: "center",
      width: 50,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      backgroundColor: theme.textPrimary,
    },
  });
  const deleteServer = async () => {
    // Get the current value of the picker.
    const currentVal = selectedServer;

    // Check to ensure not deleting the placeholder.
    if (!!selectedServer) {
      // Execute deleting the server.
      await ServerStore.init();
      await ServerStore.deleteServer(currentVal);

      // Set the selected value to null
      setSelectedServer(undefined);

      // Update the server list.
      const serverConfig = await ServerStore.getServers();
      await setServers(serverConfig);
    }
  };

  const loginToServer = async () => {
    // Create the server item.
    const sItem = selectedServer;

    if (!sItem) {
      console.warn("No server has been selected for login!");
      softErrorAlert("No valid server has been selected!");
      return;
    }


    // Decrypt the username and password.
    // TODO: Figure out the issue with the encrypted password being decrypted.
    const decryptedUsername = await ServerStore.decryptInfo(sItem.username);
    const decryptedPassword = await ServerStore.decryptInfo(sItem.password);

    const server = new Server(
      sItem.ip,
      sItem.port,
      decryptedUsername,
      decryptedPassword
    );

    // Verify if the server is online and valid.
    setLoading(true);
    const result = await server.ping();
    if (!result) {
      setLoading(false);
      softErrorAlert(
        "The server your are attemting to log into is not online or not a valid server! Please try again later."
      );
      return;
    }

    // Begin sending the login.
    const loginResult = await server.login();
    if(!loginResult) {
      setLoading(false);
      return;
    }
  };

  // Code here changes if the submit button is visisble or not.
  const [submitButtonVisible, setSubmitButtonVisible] = useState(false);
  useEffect(() => {
    setSubmitButtonVisible(!!selectedServer);
  }, [selectedServer]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Login </Text>
      <Picker style={pickerStyle.picker} onValueChange={setSelectedServer}>
        <Picker.Item label="Select a server..." value={null}></Picker.Item>
        {servers.map((item) => (
          <Picker.Item
            label={`${item.name} (${item.ip}:${item.port})`}
            value={item}
            key={item.name}
          ></Picker.Item>
        ))}
      </Picker>
      <View style={{ display: "flex", flexDirection: "row" }}>
        <TouchableOpacity
          style={[
            styles.button,
            { display: submitButtonVisible ? "flex" : "none" },
          ]}
          onPress={loginToServer}
        >
          <Text style={styles.buttonText}> Log in </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { display: submitButtonVisible ? "flex" : "none" },
          ]}
          onPress={deleteServer}
        >
          <AntDesign
            name="delete"
            size={24}
            style={{ color: theme.textPrimary }}
          />
        </TouchableOpacity>
        <Modal
          animationType={"fade"}
          backdropColor={theme.background}
          visible={loading}
          transparent={true}
        >
          <View style={modalStyle.modalView}>
            <ActivityIndicator color={theme.primaryColor} />
          </View>
        </Modal>
      </View>
    </View>
  );
}
