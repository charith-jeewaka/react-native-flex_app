import AppNavigator from "./src/navigation/AppNavigator";
import { useEffect } from "react";
import { configureNotifications } from "./src/services/notificationService";

export default function App() {
  useEffect(() => {
    configureNotifications();
  }, []);

  return <AppNavigator />;
}
