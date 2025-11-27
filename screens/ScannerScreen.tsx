import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Platform,
  Animated,
  Keyboard,
} from "react-native";
import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
import { useNavigation, useFocusEffect, CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { MainTabParamList } from "@/navigation/MainTabNavigator";
import { submitAttendance } from "@/utils/api";
import { saveRollNumber, getRollNumber, addToOfflineQueue, addAttendanceRecord } from "@/utils/storage";
import { processOfflineQueue } from "@/utils/offlineSync";

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "ScannerTab">,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function ScannerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme, isDark } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  
  const [token, setToken] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  
  const rollNumberInputRef = useRef<TextInput>(null);
  const cornerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(cornerAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(cornerAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const loadSavedRollNumber = async () => {
        const saved = await getRollNumber();
        if (saved) {
          setRollNumber(saved);
        }
      };
      loadSavedRollNumber();
      
      processOfflineQueue().catch((error) => {
        console.error("Failed to process offline queue:", error);
      });
    }, [])
  );

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    if (!hasScanned && data) {
      setHasScanned(true);
      setToken(data);
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      setTimeout(() => {
        rollNumberInputRef.current?.focus();
      }, 100);
      
      setTimeout(() => {
        setHasScanned(false);
      }, 2000);
    }
  };

  const handleSubmit = async () => {
    if (!token || !rollNumber.trim()) {
      return;
    }

    Keyboard.dismiss();
    setIsSubmitting(true);

    try {
      const result = await submitAttendance({
        studentId: rollNumber.trim(),
        token: token.trim(),
      });
      
      setIsSubmitting(false);
      
      if (result.success) {
        await saveRollNumber(rollNumber.trim());
        await addAttendanceRecord(rollNumber.trim(), "present");
        
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        navigation.navigate("Success", {
          studentName: result.studentName || rollNumber,
          timestamp: new Date().toLocaleTimeString(),
        });
        
        setToken("");
      } else {
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        
        navigation.navigate("Error", {
          message: result.message || "Attendance submission failed",
          suggestion: "Please try again",
        });
      }
    } catch (error) {
      setIsSubmitting(false);
      
      await addToOfflineQueue(rollNumber.trim(), token.trim());
      await addAttendanceRecord(rollNumber.trim(), "pending");
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      
      navigation.navigate("Error", {
        message: error instanceof Error ? error.message : "Network error",
        suggestion: "Your attendance has been saved and will be submitted when you're back online.",
      });
      
      setToken("");
    }
  };

  if (!permission) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Feather name="camera-off" size={64} color={theme.textSecondary} />
          <ThemedText style={styles.permissionTitle}>Camera Access Required</ThemedText>
          <ThemedText style={[styles.permissionText, { color: theme.textSecondary }]}>
            This app needs camera access to scan QR codes for attendance marking.
          </ThemedText>
          <Pressable
            style={({ pressed }) => [
              styles.permissionButton,
              { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={requestPermission}
          >
            <ThemedText style={[styles.buttonText, { color: Colors.light.buttonText }]}>
              Grant Permission
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  const cornerOpacity = cornerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={handleBarCodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.scanningFrame}>
              <Animated.View style={[styles.corner, styles.topLeft, { opacity: cornerOpacity }]} />
              <Animated.View style={[styles.corner, styles.topRight, { opacity: cornerOpacity }]} />
              <Animated.View style={[styles.corner, styles.bottomLeft, { opacity: cornerOpacity }]} />
              <Animated.View style={[styles.corner, styles.bottomRight, { opacity: cornerOpacity }]} />
            </View>
            <View style={styles.instructionContainer}>
              <ThemedText style={styles.instructionText}>Scan QR Code</ThemedText>
            </View>
          </View>
        </CameraView>
      </View>

      <View style={[styles.formContainer, { backgroundColor: theme.backgroundRoot }]}>
        <View style={styles.formContent}>
          <View style={styles.inputContainer}>
            <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
              Token
            </ThemedText>
            <View style={[styles.tokenInput, { borderColor: theme.divider, backgroundColor: theme.backgroundDefault }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={token}
                editable={false}
                placeholder="Scan QR code to autofill"
                placeholderTextColor={theme.textSecondary}
              />
              {token ? (
                <Feather name="check" size={20} color={theme.accent} />
              ) : null}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
              Roll Number
            </ThemedText>
            <TextInput
              ref={rollNumberInputRef}
              style={[
                styles.textInput,
                {
                  borderColor: theme.divider,
                  color: theme.text,
                  backgroundColor: theme.backgroundRoot,
                },
              ]}
              value={rollNumber}
              onChangeText={setRollNumber}
              placeholder="Enter your roll number"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              {
                backgroundColor: theme.primary,
                opacity: (!token || !rollNumber.trim() || isSubmitting) ? 0.38 : pressed ? 0.8 : 1,
              },
            ]}
            onPress={handleSubmit}
            disabled={!token || !rollNumber.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={Colors.light.buttonText} />
            ) : (
              <ThemedText style={[styles.buttonText, { color: Colors.light.buttonText }]}>
                SUBMIT ATTENDANCE
              </ThemedText>
            )}
          </Pressable>
        </View>
      </View>

      <Pressable
        style={[styles.helpButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate("Help")}
      >
        <Feather name="help-circle" size={24} color={Colors.light.buttonText} />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 6,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanningFrame: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#FFFFFF",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  instructionContainer: {
    marginTop: Spacing["3xl"],
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  instructionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  formContainer: {
    flex: 4,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  formContent: {
    padding: Spacing.lg,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
  },
  tokenInput: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: Spacing.lg,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  textInput: {
    height: 56,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  submitButton: {
    height: 48,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing["3xl"],
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  permissionText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: Spacing["3xl"],
  },
  permissionButton: {
    paddingHorizontal: Spacing["3xl"],
    paddingVertical: Spacing.lg,
    borderRadius: 4,
  },
  helpButton: {
    position: "absolute",
    top: 60,
    right: Spacing.lg,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
