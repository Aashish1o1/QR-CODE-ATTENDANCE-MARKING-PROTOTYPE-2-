import React, { useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getAttendanceHistory, AttendanceRecord } from "@/utils/storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    const records = await getAttendanceHistory();
    setHistory(records);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: AttendanceRecord }) => (
    <View style={[styles.recordCard, { backgroundColor: theme.backgroundDefault }]}>
      <View style={styles.recordHeader}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === "present"
                  ? theme.accent + "20"
                  : theme.warning + "20",
            },
          ]}
        >
          <Feather
            name={item.status === "present" ? "check-circle" : "clock"}
            size={16}
            color={item.status === "present" ? theme.accent : theme.warning}
          />
          <ThemedText
            style={[
              styles.statusText,
              {
                color: item.status === "present" ? theme.accent : theme.warning,
              },
            ]}
          >
            {item.status === "present" ? "Present" : "Pending"}
          </ThemedText>
        </View>
        <ThemedText style={[styles.dateText, { color: theme.textSecondary }]}>
          {item.date}
        </ThemedText>
      </View>
      <ThemedText style={[styles.timeText, { color: theme.textSecondary }]}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </ThemedText>
      <ThemedText style={[styles.idText, { color: theme.textSecondary }]}>
        ID: {item.studentId}
      </ThemedText>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Feather name="calendar" size={64} color={theme.textSecondary} />
      <ThemedText style={[styles.emptyTitle, { marginTop: Spacing.lg }]}>
        No Attendance Records
      </ThemedText>
      <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
        Your attendance history will appear here after you scan QR codes
      </ThemedText>
    </View>
  );

  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          history.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.lg,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["5xl"],
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: Spacing["3xl"],
  },
  recordCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: Spacing.xs,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
  },
  timeText: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  idText: {
    fontSize: 12,
  },
});
