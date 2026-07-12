import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Task } from "../models/Task";

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  editingTask?: Task | null;
}

export default function AddTaskModal({
  visible,
  onClose,
  onSave,
  editingTask,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingTask, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    onSave(title.trim(), description.trim());

    setTitle("");
    setDescription("");

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>
            {editingTask ? "Edit Task" : "New Task"}
          </Text>

          <TextInput
            placeholder="Task Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.description]}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>
                {editingTask ? "Update" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },

  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },

  description: {
    height: 120,
    textAlignVertical: "top",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    padding: 14,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
  },

  saveButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: "center",
  },

  cancelText: {
    fontWeight: "600",
    color: "#374151",
    fontSize: 16,
  },

  saveText: {
    fontWeight: "600",
    color: "#FFFFFF",
    fontSize: 16,
  },
});
