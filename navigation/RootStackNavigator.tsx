import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "./screenOptions";

import MainTabNavigator from "./MainTabNavigator";
import SuccessModal from "@/screens/SuccessModal";
import ErrorModal from "@/screens/ErrorModal";
import HelpModal from "@/screens/HelpModal";

export type RootStackParamList = {
  MainTabs: undefined;
  Success: { studentName?: string; timestamp?: string };
  Error: { message: string; suggestion?: string };
  Help: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={getCommonScreenOptions({ theme, isDark, transparent: true })}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Success"
        component={SuccessModal}
        options={{
          presentation: "transparentModal",
          headerShown: false,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="Error"
        component={ErrorModal}
        options={{
          presentation: "transparentModal",
          headerShown: false,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="Help"
        component={HelpModal}
        options={{
          presentation: "modal",
          headerTitle: "How to Use",
          headerTransparent: false,
        }}
      />
    </Stack.Navigator>
  );
}
