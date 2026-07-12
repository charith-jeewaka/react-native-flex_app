import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Task } from "../models/Task";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskCardProps) {
  const dueDate = task.dueDate?.toDate
    ? task.dueDate.toDate()
    : new Date(task.dueDate);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const normalizedDueDate = new Date(dueDate);
  normalizedDueDate.setHours(0, 0, 0, 0);

  const differenceInDays =
    (normalizedDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  let dueMessage = dueDate.toLocaleDateString();
  let dueColor = "#6B7280";
  let dueIcon: keyof typeof Ionicons.glyphMap = "calendar-outline";

  if (differenceInDays < 0) {
    dueMessage = "Expired";
    dueColor = "#EF4444";
    dueIcon = "warning-outline";
  } else if (differenceInDays === 0) {
    dueMessage = "Due Today";
    dueColor = "#EA580C";
    dueIcon = "today-outline";
  } else if (differenceInDays === 1) {
    dueMessage = "Due Tomorrow";
    dueColor = "#2563EB";
    dueIcon = "calendar-outline";
  }

  return (
    <View style={styles.card}>
      {/* Title and status badge */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, task.completed && styles.completedText]}>
          {task.title}
        </Text>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: task.completed ? "#DCFCE7" : "#FEF3C7",
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: task.completed ? "#15803D" : "#B45309",
              },
            ]}
          >
            {task.completed ? "Completed" : "Pending"}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text
        style={[styles.description, task.completed && styles.completedText]}
      >
        {task.description}
      </Text>

      {/* Due date */}
      <View style={styles.dateRow}>
        <Ionicons name={dueIcon} size={18} color={dueColor} />

        <Text
          style={[
            styles.dateText,
            {
              color: dueColor,
              fontWeight: "700",
            },
          ]}
        >
          {dueMessage}
        </Text>
      </View>

      {/* Bottom row */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={onToggleComplete}
        >
          <Ionicons
            name={task.completed ? "checkbox" : "square-outline"}
            size={24}
            color={task.completed ? "#22C55E" : "#6B7280"}
          />

          <Text
            style={[
              styles.completeText,
              {
                color: task.completed ? "#22C55E" : "#374151",
              },
            ]}
          >
            {task.completed ? "Completed" : "Pending"}
          </Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit}>
            <Ionicons name="create-outline" size={24} color="#2563EB" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginVertical: 8,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 4,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginRight: 12,
  },

  description: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 8,
    lineHeight: 22,
  },

  completedText: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 13,
    fontWeight: "700",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  dateText: {
    marginLeft: 6,
    fontSize: 14,
  },

  footer: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  completeButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  completeText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#374151",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },

  deleteButton: {
    marginLeft: 18,
  },
});
