import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import LogoutButton from "../components/LogoutButton";
import { auth } from "../services/firebase";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [taskNotifications, setTaskNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const colors = darkMode
    ? {
        background: "#0F172A",
        card: "#1E293B",
        title: "#F8FAFC",
        text: "#E2E8F0",
        secondaryText: "#94A3B8",
        border: "#334155",
        iconBackground: "#334155",
      }
    : {
        background: "#F5F7FB",
        card: "#FFFFFF",
        title: "#111827",
        text: "#1E293B",
        secondaryText: "#64748B",
        border: "#E2E8F0",
        iconBackground: "#EFF6FF",
      };

  const showComingSoon = (feature: string) => {
    Alert.alert(feature, `${feature} functionality will be added later.`);
  };

  return (
    <ScrollView
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
        },
      ]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Account summary */}
      <View
        style={[
          styles.profileCard,
          {
            backgroundColor: colors.card,
          },
        ]}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {auth.currentUser?.email?.charAt(0).toUpperCase() ?? "U"}
          </Text>
        </View>

        <View style={styles.profileDetails}>
          <Text
            style={[
              styles.profileTitle,
              {
                color: colors.title,
              },
            ]}
          >
            Account Settings
          </Text>

          <Text
            style={[
              styles.profileEmail,
              {
                color: colors.secondaryText,
              },
            ]}
            numberOfLines={1}
          >
            {auth.currentUser?.email ?? "No email available"}
          </Text>
        </View>

        <Ionicons name="shield-checkmark-outline" size={25} color="#2563EB" />
      </View>

      {/* Appearance */}
      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.secondaryText,
          },
        ]}
      >
        Appearance
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
          },
        ]}
      >
        <SettingSwitchRow
          title="Dark Mode"
          subtitle="Use a darker appearance"
          icon={darkMode ? "moon" : "moon-outline"}
          iconColor="#7C3AED"
          iconBackground={darkMode ? "#312E81" : "#F5F3FF"}
          value={darkMode}
          onValueChange={setDarkMode}
          textColor={colors.text}
          secondaryTextColor={colors.secondaryText}
        />
      </View>

      {/* Notifications */}
      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.secondaryText,
          },
        ]}
      >
        Notifications
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
          },
        ]}
      >
        <SettingSwitchRow
          title="Task Reminders"
          subtitle="Receive due-date notifications"
          icon="notifications-outline"
          iconColor="#EA580C"
          iconBackground={darkMode ? "#431407" : "#FFF7ED"}
          value={taskNotifications}
          onValueChange={setTaskNotifications}
          textColor={colors.text}
          secondaryTextColor={colors.secondaryText}
        />

        <View
          style={[
            styles.separator,
            {
              backgroundColor: colors.border,
            },
          ]}
        />

        <SettingSwitchRow
          title="Notification Sound"
          subtitle="Play a sound for reminders"
          icon="volume-high-outline"
          iconColor="#0891B2"
          iconBackground={darkMode ? "#164E63" : "#ECFEFF"}
          value={soundEnabled}
          onValueChange={setSoundEnabled}
          textColor={colors.text}
          secondaryTextColor={colors.secondaryText}
        />
      </View>

      {/* Account and security */}
      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.secondaryText,
          },
        ]}
      >
        Account & Security
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
          },
        ]}
      >
        <SettingOptionRow
          title="Change Password"
          subtitle="Update your account password"
          icon="lock-closed-outline"
          iconColor="#2563EB"
          iconBackground={darkMode ? "#1E3A8A" : "#EFF6FF"}
          textColor={colors.text}
          secondaryTextColor={colors.secondaryText}
          onPress={() => showComingSoon("Change Password")}
        />

        <View
          style={[
            styles.separator,
            {
              backgroundColor: colors.border,
            },
          ]}
        />

        <SettingOptionRow
          title="Email Verification"
          subtitle={
            auth.currentUser?.emailVerified
              ? "Your email is verified"
              : "Verify your email address"
          }
          icon={
            auth.currentUser?.emailVerified
              ? "checkmark-circle-outline"
              : "alert-circle-outline"
          }
          iconColor={auth.currentUser?.emailVerified ? "#16A34A" : "#EA580C"}
          iconBackground={
            darkMode
              ? auth.currentUser?.emailVerified
                ? "#14532D"
                : "#431407"
              : auth.currentUser?.emailVerified
                ? "#F0FDF4"
                : "#FFF7ED"
          }
          textColor={colors.text}
          secondaryTextColor={colors.secondaryText}
          onPress={() =>
            Alert.alert(
              "Email Verification",
              auth.currentUser?.emailVerified
                ? "Your email address is already verified."
                : "Please check your inbox for the Firebase verification email.",
            )
          }
        />

        <View
          style={[
            styles.separator,
            {
              backgroundColor: colors.border,
            },
          ]}
        />

        <SettingOptionRow
          title="Privacy and Security"
          subtitle="Review account-security options"
          icon="shield-checkmark-outline"
          iconColor="#7C3AED"
          iconBackground={darkMode ? "#3B0764" : "#FAF5FF"}
          textColor={colors.text}
          secondaryTextColor={colors.secondaryText}
          onPress={() => showComingSoon("Privacy and Security")}
        />
      </View>

      {/* Application */}
      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.secondaryText,
          },
        ]}
      >
        Application
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
          },
        ]}
      >
        <SettingOptionRow
          title="Help and Support"
          subtitle="Get help using the application"
          icon="help-circle-outline"
          iconColor="#0891B2"
          iconBackground={darkMode ? "#164E63" : "#ECFEFF"}
          textColor={colors.text}
          secondaryTextColor={colors.secondaryText}
          onPress={() => showComingSoon("Help and Support")}
        />

        <View
          style={[
            styles.separator,
            {
              backgroundColor: colors.border,
            },
          ]}
        />

        <SettingOptionRow
          title="About"
          subtitle="Task Manager version 1.0.0"
          icon="information-circle-outline"
          iconColor="#64748B"
          iconBackground={darkMode ? "#334155" : "#F1F5F9"}
          textColor={colors.text}
          secondaryTextColor={colors.secondaryText}
          onPress={() =>
            Alert.alert(
              "About Task Manager",
              "Task Manager\nVersion 1.0.0\n\nBuilt with React Native, Expo and Firebase.",
            )
          }
        />
      </View>

      {/* Logout */}
      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.secondaryText,
          },
        ]}
      >
        Session
      </Text>

      <View
        style={[
          styles.logoutCard,
          {
            backgroundColor: colors.card,
          },
        ]}
      >
        <View style={styles.logoutInformation}>
          <View style={styles.logoutIcon}>
            <Ionicons name="log-out-outline" size={24} color="#DC2626" />
          </View>

          <View style={styles.logoutTextContainer}>
            <Text
              style={[
                styles.logoutTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Logout
            </Text>

            <Text
              style={[
                styles.logoutSubtitle,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Sign out from your Firebase account
            </Text>
          </View>
        </View>

        <View style={styles.logoutButtonContainer}>
          <LogoutButton />
        </View>
      </View>

      <Text
        style={[
          styles.footerText,
          {
            color: colors.secondaryText,
          },
        ]}
      >
        Task Manager • Securely powered by Firebase
      </Text>
    </ScrollView>
  );
}

interface SettingSwitchRowProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackground: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  textColor: string;
  secondaryTextColor: string;
}

function SettingSwitchRow({
  title,
  subtitle,
  icon,
  iconColor,
  iconBackground,
  value,
  onValueChange,
  textColor,
  secondaryTextColor,
}: SettingSwitchRowProps) {
  return (
    <View style={styles.settingRow}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: iconBackground,
          },
        ]}
      >
        <Ionicons name={icon} size={23} color={iconColor} />
      </View>

      <View style={styles.settingTextContainer}>
        <Text
          style={[
            styles.settingTitle,
            {
              color: textColor,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.settingSubtitle,
            {
              color: secondaryTextColor,
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: "#CBD5E1",
          true: "#93C5FD",
        }}
        thumbColor={value ? "#2563EB" : "#F8FAFC"}
      />
    </View>
  );
}

interface SettingOptionRowProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackground: string;
  textColor: string;
  secondaryTextColor: string;
  onPress: () => void;
}

function SettingOptionRow({
  title,
  subtitle,
  icon,
  iconColor,
  iconBackground,
  textColor,
  secondaryTextColor,
  onPress,
}: SettingOptionRowProps) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: iconBackground,
          },
        ]}
      >
        <Ionicons name={icon} size={23} color={iconColor} />
      </View>

      <View style={styles.settingTextContainer}>
        <Text
          style={[
            styles.settingTitle,
            {
              color: textColor,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.settingSubtitle,
            {
              color: secondaryTextColor,
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={21} color="#94A3B8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 45,
  },

  profileCard: {
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2563EB",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
  },

  profileDetails: {
    flex: 1,
    marginHorizontal: 14,
  },

  profileTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  profileEmail: {
    marginTop: 4,
    fontSize: 13,
  },

  sectionTitle: {
    marginTop: 26,
    marginBottom: 10,
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },

  card: {
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

  settingRow: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 47,
    height: 47,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  settingTextContainer: {
    flex: 1,
    marginHorizontal: 13,
  },

  settingTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  settingSubtitle: {
    marginTop: 4,
    fontSize: 13,
  },

  separator: {
    height: 1,
    marginLeft: 60,
  },

  logoutCard: {
    borderRadius: 20,
    padding: 18,

    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  logoutInformation: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoutIcon: {
    width: 47,
    height: 47,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
  },

  logoutTextContainer: {
    flex: 1,
    marginLeft: 13,
  },

  logoutTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  logoutSubtitle: {
    marginTop: 4,
    fontSize: 13,
  },

  logoutButtonContainer: {
    marginTop: 18,
  },

  footerText: {
    marginTop: 28,
    textAlign: "center",
    fontSize: 12,
  },
});
