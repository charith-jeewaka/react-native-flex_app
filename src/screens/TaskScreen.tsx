import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Timestamp } from "firebase/firestore";

import SearchBar from "../components/SearchBar";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";

import {
  cancelTaskNotifications,
  scheduleTaskNotifications,
  sendTestNotification
} from "../services/notificationService";

import { Task } from "../models/Task";

import {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../services/taskService";

export default function TaskScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [search, setSearch] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase()),
  );

  // Handle add and edit
  const handleSaveTask = async (
    title: string,
    description: string,
    dueDate: Date,
  ) => {
    try {
      if (editingTask) {
        await cancelTaskNotifications(editingTask.notificationIds);

        const notificationIds = await scheduleTaskNotifications(
          editingTask.id!,
          title,
          dueDate,
        );

        await updateTask(editingTask.id!, {
          title,
          description,
          dueDate: Timestamp.fromDate(dueDate),
          notificationIds,
        });

        alert("Task Updated Successfully");
      } else {
        await addTask(title, description, dueDate);

        alert("Task Added Successfully");
      }

      setEditingTask(null);
      setModalVisible(false);

      await loadTasks();
    } catch (error) {
      console.log(error);

      alert("Something went wrong.");
    }
  };

  // Handle delete
  const handleDeleteTask = (task: Task) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await cancelTaskNotifications(task.notificationIds);

            await deleteTask(task.id!);

            await loadTasks();

            alert("Task deleted successfully.");
          } catch (error) {
            console.log(error);
            alert("Failed to delete task.");
          }
        },
      },
    ]);
  };

  // Handle toggle complete
  const handleToggleComplete = async (task: Task) => {
    try {
      const newCompletedStatus = !task.completed;

      if (newCompletedStatus) {
        await cancelTaskNotifications(task.notificationIds);

        await updateTask(task.id!, {
          completed: true,
          notificationIds: [],
        });
      } else {
        const dueDate = task.dueDate.toDate
          ? task.dueDate.toDate()
          : new Date(task.dueDate);

        const notificationIds = await scheduleTaskNotifications(
          task.id!,
          task.title,
          dueDate,
        );

        await updateTask(task.id!, {
          completed: false,
          notificationIds,
        });
      }

      await loadTasks();
    } catch (error) {
      console.log(error);
      alert("Failed to update task.");
    }
  };

  // Load tasks
  const loadTasks = async () => {
    try {
      setLoading(true);

      const data = await getTasks();

      setTasks(data);
    } catch (error) {
      console.log(error);
      alert("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  // Pull refresh
  const onRefresh = async () => {
    try {
      setRefreshing(true);

      await loadTasks();
    } finally {
      setRefreshing(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar value={search} onChangeText={setSearch} />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id ?? Math.random().toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563EB"]}
            tintColor="#2563EB"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={80} color="#CBD5E1" />

            <Text style={styles.emptyTitle}>No Tasks Yet</Text>

            <Text style={styles.emptySubtitle}>
              Tap the + button to create your first task.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onEdit={() => {
              setEditingTask(item);
              setModalVisible(true);
            }}
            onDelete={() => handleDeleteTask(item)}
            onToggleComplete={() => handleToggleComplete(item)}
          />
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingTask(null);
          setModalVisible(true);
          //sendTestNotification();
          
        }}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <AddTaskModal
        visible={modalVisible}
        editingTask={editingTask}
        onClose={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    paddingHorizontal: 20,
    paddingTop: 15,
  },

  fab: {
    position: "absolute",
    right: 25,
    bottom: 25,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#2563EB",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  emptyContainer: {
    marginTop: 120,
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  emptySubtitle: {
    marginTop: 10,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 16,
    lineHeight: 24,
  },
});
