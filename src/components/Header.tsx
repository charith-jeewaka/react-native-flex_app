import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hour = time.getHours();

  const greeting =
    hour < 12
      ? "☀️ Good Morning"
      : hour < 17
        ? "🌤 Good Afternoon"
        : "🌙 Good Evening";

  return (
    <View style={styles.container}>
      {/* Left */}
      <View style={styles.left}>
        <Text style={styles.greeting}>{greeting}</Text>

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.date}>
          {time.toLocaleDateString(undefined, {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}
        </Text>
      </View>

      {/* Right */}
      <View style={styles.right}>
        <View style={styles.clock}>
          <Ionicons name="time-outline" size={16} color="#FFFFFF" />

          <Text style={styles.time}>
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <View style={styles.avatar}>
          <Ionicons name="person" size={22} color="#2E88E9" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
  },

  left: {
    flex: 1,
  },

  greeting: {
    color: "#DDEEFF",
    fontSize: 12,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "700",
    marginVertical: 2,
  },

  date: {
    color: "#E8F4FF",
    fontSize: 12,
  },

  right: {
    alignItems: "flex-end",
  },

  clock: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 8,
  },

  time: {
    color: "#FFFFFF",
    marginLeft: 5,
    fontWeight: "700",
    fontSize: 13,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
});
