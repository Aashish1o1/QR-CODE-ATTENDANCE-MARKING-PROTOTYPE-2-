import React, { useState } from "react";
import { View, StyleSheet, RefreshControl, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getAttendanceStats, getRollNumber } from "@/utils/storage";

export default function StatsScreen() {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalRecords: 0,
    presentCount: 0,
    pendingCount: 0,
    attendanceRate: 0,
  });
  const [studentId, setStudentId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    const statsData = await getAttendanceStats();
    const id = await getRollNumber();
    setStats(statsData);
    setStudentId(id);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadStats();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const StatCard = ({
    icon,
    label,
    value,
    color,
  }: {
    icon: keyof typeof Feather.glyphMap;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
        <Feather name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
          {label}
        </ThemedText>
        <ThemedText style={styles.statValue}>{value}</ThemedText>
      </View>
    </View>
  );

  return (
    <ScreenScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.primary}
        />
      }
    >
      <View style={styles.container}>
        {studentId ? (
          <View style={[styles.profileCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.primary + "20" }]}>
              <Feather name="user" size={32} color={theme.primary} />
            </View>
            <ThemedText style={styles.studentId}>Student ID: {studentId}</ThemedText>
          </View>
        ) : null}

        <View style={[styles.summaryCard, { backgroundColor: theme.primary }]}>
          <ThemedText style={styles.summaryLabel}>Attendance Rate</ThemedText>
          <ThemedText style={styles.summaryValue}>
            {stats.attendanceRate.toFixed(1)}%
          </ThemedText>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${stats.attendanceRate}%`,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="check-circle"
            label="Present"
            value={stats.presentCount}
            color={theme.accent}
          />
          <StatCard
            icon="clock"
            label="Pending"
            value={stats.pendingCount}
            color={theme.warning}
          />
        </View>

        <StatCard
          icon="calendar"
          label="Total Records"
          value={stats.totalRecords}
          color={theme.primary}
        />

        <View style={[styles.infoCard, { backgroundColor: theme.backgroundSecondary }]}>
          <View style={styles.infoHeader}>
            <Feather name="info" size={20} color={theme.primary} />
            <ThemedText style={[styles.infoTitle, { marginLeft: Spacing.sm }]}>
              About Your Stats
            </ThemedText>
          </View>
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoBullet}>•</ThemedText>
            <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
              Present: Successfully submitted attendance
            </ThemedText>
          </View>
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoBullet}>•</ThemedText>
            <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
              Pending: Saved offline, will auto-submit when online
            </ThemedText>
          </View>
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoBullet}>•</ThemedText>
            <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
              Rate is calculated from present records only
            </ThemedText>
          </View>
        </View>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
  },
  studentId: {
    fontSize: 18,
    fontWeight: "600",
  },
  summaryCard: {
    padding: Spacing["3xl"],
    borderRadius: BorderRadius.md,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  summaryLabel: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: Spacing.sm,
  },
  summaryValue: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "700",
    marginBottom: Spacing.lg,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  infoCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.lg,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
  },
  infoBullet: {
    fontSize: 14,
    marginRight: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
