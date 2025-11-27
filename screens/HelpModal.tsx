import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import ScreenScrollView from "@/components/ScreenScrollView";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function HelpModal() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const steps = [
    {
      icon: "camera" as const,
      title: "Scan QR Code",
      description: "Point your camera at the QR code displayed by your instructor",
    },
    {
      icon: "check-square" as const,
      title: "Token Auto-fills",
      description: "The attendance token will automatically fill in from the QR code",
    },
    {
      icon: "edit" as const,
      title: "Enter Roll Number",
      description: "Type your student roll number in the field provided",
    },
    {
      icon: "send" as const,
      title: "Submit",
      description: "Tap the submit button to mark your attendance",
    },
  ];

  return (
    <ScreenScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>How to Use</ThemedText>
        <ThemedText style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          Follow these simple steps to mark your attendance
        </ThemedText>
      </View>

      {steps.map((step, index) => (
        <View key={index} style={[styles.stepCard, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.stepHeader}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primary + "20" }]}>
              <Feather name={step.icon} size={24} color={theme.primary} />
            </View>
            <View style={styles.stepNumber}>
              <ThemedText style={[styles.stepNumberText, { color: theme.textSecondary }]}>
                Step {index + 1}
              </ThemedText>
            </View>
          </View>
          <ThemedText style={styles.stepTitle}>{step.title}</ThemedText>
          <ThemedText style={[styles.stepDescription, { color: theme.textSecondary }]}>
            {step.description}
          </ThemedText>
        </View>
      ))}

      <View style={[styles.tipsCard, { backgroundColor: theme.backgroundSecondary }]}>
        <View style={styles.tipsHeader}>
          <Feather name="info" size={20} color={theme.primary} />
          <ThemedText style={[styles.tipsTitle, { marginLeft: Spacing.sm }]}>
            Tips
          </ThemedText>
        </View>
        <View style={styles.tip}>
          <ThemedText style={styles.bullet}>•</ThemedText>
          <ThemedText style={[styles.tipText, { color: theme.textSecondary }]}>
            Make sure you have a stable internet connection
          </ThemedText>
        </View>
        <View style={styles.tip}>
          <ThemedText style={styles.bullet}>•</ThemedText>
          <ThemedText style={[styles.tipText, { color: theme.textSecondary }]}>
            Ensure the QR code is well-lit and in focus
          </ThemedText>
        </View>
        <View style={styles.tip}>
          <ThemedText style={styles.bullet}>•</ThemedText>
          <ThemedText style={[styles.tipText, { color: theme.textSecondary }]}>
            The token expires after 10 minutes, so scan the latest QR code
          </ThemedText>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.closeButton,
          { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={() => navigation.goBack()}
      >
        <ThemedText style={styles.closeButtonText}>GOT IT</ThemedText>
      </Pressable>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing["3xl"],
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  stepCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumber: {
    marginLeft: "auto",
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  tipsCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing["3xl"],
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  tip: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
  },
  bullet: {
    fontSize: 14,
    marginRight: Spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    height: 48,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
