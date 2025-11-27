import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type SuccessRouteProp = RouteProp<RootStackParamList, "Success">;

export default function SuccessModal() {
  const navigation = useNavigation();
  const route = useRoute<SuccessRouteProp>();
  const { theme } = useTheme();
  
  const { studentName, timestamp } = route.params || {};
  
  const scaleAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnimation, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDismiss = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.backdrop}>
      <Pressable style={styles.backdrop} onPress={handleDismiss} />
      <Animated.View
        style={[
          styles.modal,
          { backgroundColor: theme.backgroundRoot, transform: [{ scale: scaleAnimation }] },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: Colors.light.accent + "20" }]}>
          <Feather name="check-circle" size={64} color={Colors.light.accent} />
        </View>
        
        <ThemedText style={styles.title}>Attendance Marked!</ThemedText>
        
        {studentName ? (
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            Welcome, {studentName}
          </ThemedText>
        ) : null}
        
        {timestamp ? (
          <ThemedText style={[styles.timestamp, { color: theme.textSecondary }]}>
            {timestamp}
          </ThemedText>
        ) : null}
        
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={handleDismiss}
        >
          <ThemedText style={[styles.buttonText, { color: Colors.light.buttonText }]}>
            DONE
          </ThemedText>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  modal: {
    width: "85%",
    maxWidth: 400,
    borderRadius: BorderRadius.md,
    padding: Spacing["3xl"],
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  timestamp: {
    fontSize: 14,
    marginBottom: Spacing["3xl"],
    textAlign: "center",
  },
  button: {
    width: "100%",
    height: 48,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
