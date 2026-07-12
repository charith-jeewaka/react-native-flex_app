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
} from "firebase/firestore";

import { Task } from "../models/Task";

export const addTask = async (title: string, description: string) => {
  const user = auth.currentUser;

  if (!user) throw new Error("User not logged in.");

  await addDoc(collection(db, "users", user.uid, "tasks"), {
    title,
    description,
    completed: false,
    createdAt: serverTimestamp(),
  });
};

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

export const updateTask = async (id: string, data: Partial<Task>) => {
  const user = auth.currentUser;

  if (!user) return;

  await updateDoc(doc(db, "users", user.uid, "tasks", id), data);
};

export const deleteTask = async (id: string) => {
  const user = auth.currentUser;

  if (!user) return;

  await deleteDoc(doc(db, "users", user.uid, "tasks", id));
};