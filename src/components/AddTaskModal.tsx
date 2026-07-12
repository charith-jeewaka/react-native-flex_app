import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Task } from "../models/Task";

import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, dueDate: Date) => void;
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

  const [dueDate, setDueDate] = useState<Date>(
    new Date(Date.now() + 24 * 60 * 60 * 1000),
  );

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);

      if (editingTask.dueDate) {
        if (typeof editingTask.dueDate.toDate === "function") {
          setDueDate(editingTask.dueDate.toDate());
        } else {
          setDueDate(new Date(editingTask.dueDate));
        }
      } else {
        setDueDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
      }
    } else {
      setTitle("");
      setDescription("");

      setDueDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
    }
  }, [editingTask, visible]);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "ios") {
      setShowDatePicker(false);
    }

    if (event.type === "dismissed" || !selectedDate) {
      return;
    }

    setDueDate(selectedDate);
  };

  const openDatePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: dueDate,
        mode: "date",
        minimumDate: new Date(),
        onChange: handleDateChange,
      });

      return;
    }

    setShowDatePicker(true);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    const selectedDueDate = new Date(dueDate);
    selectedDueDate.setHours(23, 59, 59, 999);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDueDate.getTime() < today.getTime()) {
      alert("Please select today or a future date.");
      return;
    }

    onSave(title.trim(), description.trim(), dueDate);

    setTitle("");
    setDescription("");

    setDueDate(new Date(Date.now() + 24 * 60 * 60 * 1000));

    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
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

          <Text style={styles.dateLabel}>Due Date</Text>

          <TouchableOpacity style={styles.dateButton} onPress={openDatePicker}>
            <Text style={styles.dateButtonText}>
              {dueDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {Platform.OS === "ios" && showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}

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

  dateLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  dateButton: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },

  dateButtonText: {
    fontSize: 16,
    color: "#111827",
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
