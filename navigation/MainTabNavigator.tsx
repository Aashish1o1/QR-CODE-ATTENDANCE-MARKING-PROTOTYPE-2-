import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { Platform } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import ScannerScreen from "@/screens/ScannerScreen";
import HistoryScreen from "@/screens/HistoryScreen";
import StatsScreen from "@/screens/StatsScreen";
import HeaderTitle from "@/components/HeaderTitle";
import { getCommonScreenOptions } from "./screenOptions";

export type MainTabParamList = {
  ScannerTab: undefined;
  History: undefined;
  Stats: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark, transparent: true }),
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.backgroundRoot,
          borderTopColor: theme.divider,
          borderTopWidth: Platform.select({ ios: 0.5, android: 1, default: 1 }),
        },
        headerTransparent: true,
        headerBlurEffect: isDark ? "dark" : "light",
      }}
    >
      <Tab.Screen
        name="ScannerTab"
        component={ScannerScreen}
        options={{
          title: "Scanner",
          headerTitle: () => <HeaderTitle />,
          tabBarIcon: ({ color, size }) => (
            <Feather name="camera" size={size} color={color} />
          ),
          headerRight: () => null,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size }) => (
            <Feather name="bar-chart-2" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
