import { auth, db } from "./firebase";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

import { Task } from "../models/Task";

// Add Task
export const addTask = async (
  title: string,
  description: string,
  dueDate: Date,
) => {
  const user = auth.currentUser;

  if (!user) throw new Error("User not logged in.");

  await addDoc(collection(db, "users", user.uid, "tasks"), {
    title,
    description,
    completed: false,
    createdAt: serverTimestamp(),
    dueDate: Timestamp.fromDate(dueDate),
  });
};

// Get Tasks
export const getTasks = async (): Promise<Task[]> => {
  const user = auth.currentUser;

  if (!user) return [];

  const q = query(
    collection(db, "users", user.uid, "tasks"),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Task, "id">),
  }));
};

// Update Task
export const updateTask = async (id: string, data: Partial<Task>) => {
  const user = auth.currentUser;

  if (!user) return;

  await updateDoc(doc(db, "users", user.uid, "tasks", id), data);
};

// Delete Task
export const deleteTask = async (id: string) => {
  const user = auth.currentUser;

  if (!user) return;

  await deleteDoc(doc(db, "users", user.uid, "tasks", id));
};
