import React, { useState } from "react";
import {View,StyleSheet,FlatList,TouchableOpacity,Text,} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import SearchBar from "../components/SearchBar";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";

import { ActivityIndicator } from "react-native";

import { Task } from "../models/Task";

import { useEffect } from "react";

import { addTask, getTasks } from "../services/taskService";

export default function TaskScreen() {
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

  const handleSaveTask = async (title: string, description: string) => {
    try {
      await addTask(title, description);

      setModalVisible(false);

      await loadTasks();

      alert("Task Added Successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to save task.");
    }
  };

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


  //loading
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
        contentContainerStyle={{
          paddingBottom: 100,
        }}
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
            onDelete={() => {}}
            onToggleComplete={() => {}}
          />
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingTask(null);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <AddTaskModal
        visible={modalVisible}
        editingTask={editingTask}
        onClose={() => setModalVisible(false)}
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
