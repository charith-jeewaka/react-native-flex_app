import { View, Text } from "react-native";
import LogoutButton from "../components/LogoutButton";

export default function SettingsScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 28 }}>Settings Screen</Text>
      <LogoutButton/>
    </View>
  );
}
