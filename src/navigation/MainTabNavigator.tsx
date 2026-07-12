import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import TasksScreen from "../screens/TaskScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type MainTabParamList = {
  Home: undefined;
  Tasks: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />

      <Tab.Screen name="Tasks" component={TasksScreen} />

      <Tab.Screen name="Profile" component={ProfileScreen} />

    </Tab.Navigator>
  );
}
