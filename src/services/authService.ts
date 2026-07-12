import { Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { NavigationProp } from "@react-navigation/native";

export const handleLogout = (navigation: NavigationProp<any>) => {
  Alert.alert("Logout", "Are you sure you want to logout?", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Logout",
      style: "destructive",
      onPress: async () => {
        try {
          await signOut(auth);

          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        } catch (error) {
          Alert.alert("Error", "Failed to logout.");
        }
      },
    },
  ]);
};
