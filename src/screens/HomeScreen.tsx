import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-gifted-charts";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { auth } from "../services/firebase";
import { getTasks } from "../services/taskService";
import { Task } from "../models/Task";
import { MainTabParamList } from "../navigation/MainTabNavigator";

type HomeNavigationProp = BottomTabNavigationProp<MainTabParamList, "Home">;

interface SummaryCardProps {
  title: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackground: string;
}

interface ShortcutCardProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackground: string;
  onPress: () => void;
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const user = auth.currentUser;

  const username = user?.displayName || user?.email?.split("@")[0] || "User";

  const loadDashboard = useCallback(async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.log("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard]),
  );

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadDashboard();
    } finally {
      setRefreshing(false);
    }
  };

  const summary = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let completed = 0;
    let pending = 0;
    let dueToday = 0;
    let expired = 0;

    tasks.forEach((task) => {
      if (task.completed) {
        completed += 1;
        return;
      }

      pending += 1;

      if (!task.dueDate) {
        return;
      }

      const dueDate =
        typeof task.dueDate.toDate === "function"
          ? task.dueDate.toDate()
          : new Date(task.dueDate);

      dueDate.setHours(0, 0, 0, 0);

      if (dueDate.getTime() === today.getTime()) {
        dueToday += 1;
      } else if (dueDate.getTime() < today.getTime()) {
        expired += 1;
      }
    });

    return {
      total: tasks.length,
      completed,
      pending,
      dueToday,
      expired,
    };
  }, [tasks]);

  const completionPercentage =
    summary.total === 0
      ? 0
      : Math.round((summary.completed / summary.total) * 100);

  const chartData = [
    {
      value: summary.completed,
      color: "#22C55E",
      text: `${summary.completed}`,
    },
    {
      value: summary.pending,
      color: "#F59E0B",
      text: `${summary.pending}`,
    },
  ];

  const recentTasks = tasks.slice(0, 3);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#2563EB"]}
          tintColor="#2563EB"
        />
      }
    >
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeLabel}>Welcome back,</Text>

          <Text style={styles.username} numberOfLines={1}>
            {username}
          </Text>

          <Text style={styles.welcomeMessage}>
            Organize your work and complete your tasks on time.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Tasks")}
          >
            <Text style={styles.primaryButtonText}>View Tasks</Text>

            <Ionicons name="arrow-forward" size={18} color="#2563EB" />
          </TouchableOpacity>
        </View>

        <View style={styles.welcomeIcon}>
          <Ionicons name="checkmark-done-circle" size={72} color="#FFFFFF" />
        </View>

        <View style={styles.circleOne} />
        <View style={styles.circleTwo} />
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Task Summary</Text>
          <Text style={styles.sectionSubtitle}>Your current task overview</Text>
        </View>

        <View style={styles.totalBadge}>
          <Text style={styles.totalBadgeText}>{summary.total} Total</Text>
        </View>
      </View>

      <View style={styles.summaryGrid}>
        <SummaryCard
          title="Total Tasks"
          value={summary.total}
          icon="layers-outline"
          iconColor="#2563EB"
          iconBackground="#DBEAFE"
        />

        <SummaryCard
          title="Completed"
          value={summary.completed}
          icon="checkmark-circle-outline"
          iconColor="#16A34A"
          iconBackground="#DCFCE7"
        />

        <SummaryCard
          title="Due Today"
          value={summary.dueToday}
          icon="today-outline"
          iconColor="#EA580C"
          iconBackground="#FFEDD5"
        />

        <SummaryCard
          title="Expired"
          value={summary.expired}
          icon="warning-outline"
          iconColor="#DC2626"
          iconBackground="#FEE2E2"
        />
      </View>

      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartTitle}>Task Progress</Text>
            <Text style={styles.chartSubtitle}>
              Completed and pending tasks
            </Text>
          </View>

          <View style={styles.chartHeaderIcon}>
            <Ionicons name="pie-chart-outline" size={24} color="#2563EB" />
          </View>
        </View>

        {summary.total === 0 ? (
          <View style={styles.emptyChart}>
            <Ionicons name="pie-chart-outline" size={55} color="#CBD5E1" />

            <Text style={styles.emptyChartTitle}>No chart data</Text>

            <Text style={styles.emptyChartSubtitle}>
              Add tasks to see your progress.
            </Text>
          </View>
        ) : (
          <View style={styles.chartContent}>
            <PieChart
              data={chartData}
              donut
              radius={82}
              innerRadius={56}
              showText
              textColor="#FFFFFF"
              textSize={13}
              focusOnPress
              centerLabelComponent={() => (
                <View style={styles.chartCenter}>
                  <Text style={styles.percentageText}>
                    {completionPercentage}%
                  </Text>

                  <Text style={styles.percentageLabel}>Complete</Text>
                </View>
              )}
            />

            <View style={styles.legend}>
              <LegendItem
                title="Completed"
                value={summary.completed}
                color="#22C55E"
              />

              <LegendItem
                title="Pending"
                value={summary.pending}
                color="#F59E0B"
              />

              <View style={styles.progressLine}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${completionPercentage}%`,
                    },
                  ]}
                />
              </View>

              <Text style={styles.progressMessage}>
                {completionPercentage === 100
                  ? "All tasks completed!"
                  : "Keep going—you are making progress."}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionSubtitle}>
            Easily access main features
          </Text>
        </View>
      </View>

      <View style={styles.shortcuts}>
        <ShortcutCard
          title="Manage Tasks"
          subtitle="Create, edit and delete tasks"
          icon="list-outline"
          iconColor="#2563EB"
          iconBackground="#EFF6FF"
          onPress={() => navigation.navigate("Tasks")}
        />

        <ShortcutCard
          title="My Profile"
          subtitle="View account information"
          icon="person-outline"
          iconColor="#7C3AED"
          iconBackground="#F5F3FF"
          onPress={() => navigation.navigate("Profile")}
        />

        <ShortcutCard
          title="Settings"
          subtitle="Manage application preferences"
          icon="settings-outline"
          iconColor="#EA580C"
          iconBackground="#FFF7ED"
          onPress={() => navigation.navigate("Settings")}
        />
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Recent Tasks</Text>
          <Text style={styles.sectionSubtitle}>Your latest task activity</Text>
        </View>

        {tasks.length > 0 && (
          <TouchableOpacity onPress={() => navigation.navigate("Tasks")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.recentCard}>
        {recentTasks.length === 0 ? (
          <View style={styles.emptyRecent}>
            <View style={styles.emptyRecentIcon}>
              <Ionicons name="clipboard-outline" size={36} color="#94A3B8" />
            </View>

            <Text style={styles.emptyRecentTitle}>No tasks yet</Text>

            <Text style={styles.emptyRecentSubtitle}>
              Add your first task from the Tasks screen.
            </Text>
          </View>
        ) : (
          recentTasks.map((task, index) => (
            <React.Fragment key={task.id ?? index}>
              <RecentTaskRow task={task} />

              {index < recentTasks.length - 1 && (
                <View style={styles.separator} />
              )}
            </React.Fragment>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  iconColor,
  iconBackground,
}: SummaryCardProps) {
  return (
    <View style={styles.summaryCard}>
      <View
        style={[
          styles.summaryIcon,
          {
            backgroundColor: iconBackground,
          },
        ]}
      >
        <Ionicons name={icon} size={25} color={iconColor} />
      </View>

      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryCardTitle}>{title}</Text>
    </View>
  );
}

function LegendItem({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <View style={styles.legendRow}>
      <View
        style={[
          styles.legendDot,
          {
            backgroundColor: color,
          },
        ]}
      />

      <Text style={styles.legendTitle}>{title}</Text>
      <Text style={styles.legendValue}>{value}</Text>
    </View>
  );
}

function ShortcutCard({
  title,
  subtitle,
  icon,
  iconColor,
  iconBackground,
  onPress,
}: ShortcutCardProps) {
  return (
    <TouchableOpacity
      style={styles.shortcutCard}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <View
        style={[
          styles.shortcutIcon,
          {
            backgroundColor: iconBackground,
          },
        ]}
      >
        <Ionicons name={icon} size={27} color={iconColor} />
      </View>

      <View style={styles.shortcutText}>
        <Text style={styles.shortcutTitle}>{title}</Text>
        <Text style={styles.shortcutSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={21} color="#94A3B8" />
    </TouchableOpacity>
  );
}

function RecentTaskRow({ task }: { task: Task }) {
  let dueText = "No due date";
  let dueColor = "#64748B";

  if (task.dueDate) {
    const dueDate =
      typeof task.dueDate.toDate === "function"
        ? task.dueDate.toDate()
        : new Date(task.dueDate);

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const difference =
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (task.completed) {
      dueText = "Completed";
      dueColor = "#16A34A";
    } else if (difference < 0) {
      dueText = "Expired";
      dueColor = "#DC2626";
    } else if (difference === 0) {
      dueText = "Due Today";
      dueColor = "#EA580C";
    } else if (difference === 1) {
      dueText = "Due Tomorrow";
      dueColor = "#2563EB";
    } else {
      dueText = dueDate.toLocaleDateString();
    }
  }

  return (
    <View style={styles.recentRow}>
      <View
        style={[
          styles.recentStatusIcon,
          {
            backgroundColor: task.completed ? "#DCFCE7" : "#FEF3C7",
          },
        ]}
      >
        <Ionicons
          name={task.completed ? "checkmark" : "time-outline"}
          size={20}
          color={task.completed ? "#16A34A" : "#D97706"}
        />
      </View>

      <View style={styles.recentText}>
        <Text
          style={[styles.recentTitle, task.completed && styles.completedTitle]}
          numberOfLines={1}
        >
          {task.title}
        </Text>

        <Text
          style={[
            styles.recentDue,
            {
              color: dueColor,
            },
          ]}
        >
          {dueText}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 45,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },

  welcomeCard: {
    minHeight: 205,
    borderRadius: 26,
    padding: 22,
    backgroundColor: "#2563EB",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 7,
  },

  welcomeContent: {
    flex: 1,
    zIndex: 2,
  },

  welcomeLabel: {
    color: "#BFDBFE",
    fontSize: 15,
    fontWeight: "600",
  },

  username: {
    marginTop: 3,
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    textTransform: "capitalize",
  },

  welcomeMessage: {
    marginTop: 10,
    maxWidth: 230,
    color: "#DBEAFE",
    fontSize: 14,
    lineHeight: 21,
  },

  primaryButton: {
    alignSelf: "flex-start",
    marginTop: 18,
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
  },

  primaryButtonText: {
    marginRight: 7,
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "800",
  },

  welcomeIcon: {
    width: 92,
    height: 92,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },

  circleOne: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    right: -55,
    top: -60,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  circleTwo: {
    position: "absolute",
    width: 105,
    height: 105,
    borderRadius: 52.5,
    right: 45,
    bottom: -65,
    backgroundColor: "rgba(255,255,255,0.07)",
  },

  sectionHeader: {
    marginTop: 28,
    marginBottom: 13,
    paddingHorizontal: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "800",
  },

  sectionSubtitle: {
    marginTop: 3,
    color: "#94A3B8",
    fontSize: 13,
  },

  totalBadge: {
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: "#DBEAFE",
  },

  totalBadgeText: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "800",
  },

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  summaryCard: {
    width: "48.3%",
    minHeight: 150,
    marginBottom: 13,
    borderRadius: 20,
    padding: 17,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },

  summaryIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  summaryValue: {
    marginTop: 15,
    color: "#111827",
    fontSize: 28,
    fontWeight: "900",
  },

  summaryCardTitle: {
    marginTop: 3,
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },

  chartCard: {
    marginTop: 4,
    borderRadius: 22,
    padding: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },

  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  chartTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "800",
  },

  chartSubtitle: {
    marginTop: 4,
    color: "#94A3B8",
    fontSize: 13,
  },

  chartHeaderIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  chartContent: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  chartCenter: {
    alignItems: "center",
  },

  percentageText: {
    color: "#111827",
    fontSize: 21,
    fontWeight: "900",
  },

  percentageLabel: {
    marginTop: 2,
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "600",
  },

  legend: {
    flex: 1,
    marginLeft: 22,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },

  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  legendTitle: {
    flex: 1,
    marginLeft: 9,
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },

  legendValue: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "800",
  },

  progressLine: {
    height: 8,
    marginTop: 14,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#2563EB",
  },

  progressMessage: {
    marginTop: 9,
    color: "#64748B",
    fontSize: 12,
    lineHeight: 17,
  },

  emptyChart: {
    height: 210,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyChartTitle: {
    marginTop: 12,
    color: "#334155",
    fontSize: 16,
    fontWeight: "800",
  },

  emptyChartSubtitle: {
    marginTop: 5,
    color: "#94A3B8",
    fontSize: 13,
  },

  shortcuts: {
    gap: 11,
  },

  shortcutCard: {
    minHeight: 82,
    borderRadius: 19,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 2,
  },

  shortcutIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  shortcutText: {
    flex: 1,
    marginHorizontal: 14,
  },

  shortcutTitle: {
    color: "#1E293B",
    fontSize: 16,
    fontWeight: "800",
  },

  shortcutSubtitle: {
    marginTop: 4,
    color: "#94A3B8",
    fontSize: 13,
  },

  seeAllText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "800",
  },

  recentCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },

  recentRow: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
  },

  recentStatusIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  recentText: {
    flex: 1,
    marginHorizontal: 13,
  },

  recentTitle: {
    color: "#1E293B",
    fontSize: 15,
    fontWeight: "800",
  },

  completedTitle: {
    color: "#94A3B8",
    textDecorationLine: "line-through",
  },

  recentDue: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "700",
  },

  separator: {
    height: 1,
    marginLeft: 56,
    backgroundColor: "#F1F5F9",
  },

  emptyRecent: {
    minHeight: 190,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  emptyRecentIcon: {
    width: 66,
    height: 66,
    borderRadius: 22,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyRecentTitle: {
    marginTop: 14,
    color: "#1E293B",
    fontSize: 17,
    fontWeight: "800",
  },

  emptyRecentSubtitle: {
    marginTop: 5,
    color: "#94A3B8",
    fontSize: 13,
    textAlign: "center",
  },
});
