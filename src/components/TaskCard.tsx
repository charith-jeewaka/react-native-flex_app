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
  return (
    <View style={styles.card}>
      {/* Title */}
      <Text style={[styles.title, task.completed && styles.completedText]}>
        {task.title}
      </Text>

      {/* Description */}
      <Text
        style={[styles.description, task.completed && styles.completedText]}
      >
        {task.description}
      </Text>

      {/* Bottom Row */}
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

          <Text style={styles.completeText}>
            {task.completed ? "Completed" : "Mark Complete"}
          </Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit}>
            <Ionicons name="create-outline" size={24} color="#2563EB" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete} style={{ marginLeft: 18 }}>
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

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
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
});
