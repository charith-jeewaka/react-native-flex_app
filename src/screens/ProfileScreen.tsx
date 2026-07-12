import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../services/firebase";


export default function ProfileScreen() {
  const user = auth.currentUser;

  const email = user?.email ?? "No email available";

  const displayName =
    user?.displayName ?? email.split("@")[0] ?? "Task Manager User";

  const firstLetter = displayName.charAt(0).toUpperCase();

  const emailVerified = user?.emailVerified ?? false;

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing will be added later.");
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "Password reset functionality will be added later.",
    );
  };

  const handleHelp = () => {
    Alert.alert(
      "Help and Support",
      "Contact the Task Manager support team for assistance.",
    );
  };
  

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{firstLetter}</Text>

          <View style={styles.onlineIndicator} />
        </View>

        <Text style={styles.userName}>{displayName}</Text>

        <Text style={styles.userEmail}>{email}</Text>

        <View
          style={[
            styles.verificationBadge,
            {
              backgroundColor: emailVerified ? "#DCFCE7" : "#FEF3C7",
            },
          ]}
        >
          <Ionicons
            name={emailVerified ? "checkmark-circle" : "alert-circle"}
            size={17}
            color={emailVerified ? "#15803D" : "#B45309"}
          />

          <Text
            style={[
              styles.verificationText,
              {
                color: emailVerified ? "#15803D" : "#B45309",
              },
            ]}
          >
            {emailVerified ? "Verified Account" : "Email Not Verified"}
          </Text>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View
            style={[styles.statIconContainer, { backgroundColor: "#DBEAFE" }]}
          >
            <Ionicons name="document-text-outline" size={23} color="#2563EB" />
          </View>

          <Text style={styles.statValue}>Tasks</Text>
          <Text style={styles.statLabel}>Manage your work</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View
            style={[styles.statIconContainer, { backgroundColor: "#DCFCE7" }]}
          >
            <Ionicons name="checkmark-done-outline" size={23} color="#16A34A" />
          </View>

          <Text style={styles.statValue}>Progress</Text>
          <Text style={styles.statLabel}>Track completion</Text>
        </View>
      </View>

      {/* Account information */}
      <Text style={styles.sectionTitle}>Account Information</Text>

      <View style={styles.card}>
        <View style={styles.informationRow}>
          <View style={[styles.menuIcon, { backgroundColor: "#EFF6FF" }]}>
            <Ionicons name="person-outline" size={22} color="#2563EB" />
          </View>

          <View style={styles.informationContent}>
            <Text style={styles.informationLabel}>Username</Text>

            <Text style={styles.informationValue} numberOfLines={1}>
              {displayName}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.informationRow}>
          <View style={[styles.menuIcon, { backgroundColor: "#F0FDF4" }]}>
            <Ionicons name="mail-outline" size={22} color="#16A34A" />
          </View>

          <View style={styles.informationContent}>
            <Text style={styles.informationLabel}>Email Address</Text>

            <Text style={styles.informationValue} numberOfLines={1}>
              {email}
            </Text>
          </View>
        </View>
      </View>

      {/* Profile options */}
      <Text style={styles.sectionTitle}>Profile Settings</Text>

      <View style={styles.card}>
        <ProfileOption
          icon="create-outline"
          iconColor="#2563EB"
          iconBackground="#EFF6FF"
          title="Edit Profile"
          subtitle="Update your personal details"
          onPress={handleEditProfile}
        />

        <View style={styles.separator} />

        <ProfileOption
          icon="lock-closed-outline"
          iconColor="#7C3AED"
          iconBackground="#F5F3FF"
          title="Change Password"
          subtitle="Secure your Firebase account"
          onPress={handleChangePassword}
        />

        <View style={styles.separator} />

        <ProfileOption
          icon="notifications-outline"
          iconColor="#EA580C"
          iconBackground="#FFF7ED"
          title="Task Notifications"
          subtitle="Manage task reminder settings"
          onPress={() =>
            Alert.alert(
              "Task Notifications",
              "Notification settings will be available soon.",
            )
          }
        />

        <View style={styles.separator} />

        <ProfileOption
          icon="help-circle-outline"
          iconColor="#0891B2"
          iconBackground="#ECFEFF"
          title="Help and Support"
          subtitle="Get help using the application"
          onPress={handleHelp}
        />

        <View style={styles.separator} />

        <ProfileOption
          icon="help-circle-outline"
          iconColor="#ff0000"
          iconBackground="#ECFEFF"
          title="Log Out"
          subtitle="Log Out from this Account"
          onPress={handleHelp}
        />
      </View>

      <View style={styles.footer}>
        <Ionicons name="shield-checkmark-outline" size={18} color="#94A3B8" />

        <Text style={styles.footerText}>
          Your account is protected by Firebase Authentication
        </Text>
      </View>
    </ScrollView>
  );
}

interface ProfileOptionProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackground: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

function ProfileOption({
  icon,
  iconColor,
  iconBackground,
  title,
  subtitle,
  onPress,
}: ProfileOptionProps) {
  return (
    <TouchableOpacity
      style={styles.optionRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.menuIcon,
          {
            backgroundColor: iconBackground,
          },
        ]}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>

      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{title}</Text>

        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={21} color="#94A3B8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  profileHeader: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,

    shadowColor: "#000000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "#DBEAFE",
    position: "relative",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "800",
  },

  onlineIndicator: {
    position: "absolute",
    right: 3,
    bottom: 7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#22C55E",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  userName: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    textTransform: "capitalize",
  },

  userEmail: {
    marginTop: 5,
    fontSize: 15,
    color: "#64748B",
  },

  verificationBadge: {
    marginTop: 14,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
  },

  verificationText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "700",
  },

  statsContainer: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statDivider: {
    width: 1,
    height: 70,
    backgroundColor: "#E2E8F0",
  },

  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 9,
  },

  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  statLabel: {
    marginTop: 3,
    fontSize: 12,
    color: "#94A3B8",
  },

  sectionTitle: {
    marginTop: 26,
    marginBottom: 10,
    marginLeft: 4,
    color: "#475569",
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,

    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  informationRow: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
  },

  informationContent: {
    flex: 1,
    marginLeft: 13,
  },

  informationLabel: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "600",
  },

  informationValue: {
    marginTop: 3,
    fontSize: 16,
    color: "#1E293B",
    fontWeight: "700",
  },

  menuIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  separator: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 58,
  },

  optionRow: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
  },

  optionContent: {
    flex: 1,
    marginHorizontal: 13,
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },

  optionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#94A3B8",
  },

  footer: {
    marginTop: 26,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  footerText: {
    marginLeft: 7,
    flexShrink: 1,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: "#94A3B8",
  },
});
