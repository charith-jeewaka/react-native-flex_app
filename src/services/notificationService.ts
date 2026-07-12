import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const configureNotifications = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("task-reminders", {
      name: "Task Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: "default",
    });
  }

  const currentPermission = await Notifications.getPermissionsAsync();

  let finalStatus = currentPermission.status;

  if (finalStatus !== "granted") {
    const requestedPermission = await Notifications.requestPermissionsAsync();

    finalStatus = requestedPermission.status;
  }

  return finalStatus === "granted";
};


//helper for notification time
const createReminderTime = (dueDate: Date, dayOffset: number): Date => {
  const reminderDate = new Date(dueDate);

  reminderDate.setDate(reminderDate.getDate() + dayOffset);

  // Send the reminder at 9:00 AM.
  reminderDate.setHours(9, 0, 0, 0);

  return reminderDate;
};


//scheduling method
export const scheduleTaskNotifications = async (
  taskId: string,
  title: string,
  dueDate: Date,
): Promise<string[]> => {
  const permissionGranted = await configureNotifications();

  if (!permissionGranted) {
    return [];
  }

  const notificationIds: string[] = [];
  const currentTime = new Date();

  const reminders = [
    {
      date: createReminderTime(dueDate, -1),
      title: "Task Due Tomorrow",
      body: `"${title}" is due tomorrow.`,
      type: "due-tomorrow",
    },
    {
      date: createReminderTime(dueDate, 0),
      title: "Task Due Today",
      body: `"${title}" is due today.`,
      type: "due-today",
    },
    {
      date: createReminderTime(dueDate, 1),
      title: "Task Expired",
      body: `"${title}" has passed its due date.`,
      type: "expired",
    },
  ];

  for (const reminder of reminders) {
    // Do not schedule reminders whose time has already passed.
    if (reminder.date.getTime() <= currentTime.getTime()) {
      continue;
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: reminder.title,
        body: reminder.body,
        sound: "default",
        data: {
          taskId,
          notificationType: reminder.type,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminder.date,
        channelId: "task-reminders",
      },
    });

    notificationIds.push(identifier);
  }

  return notificationIds;
};

//cancel notification
export const cancelTaskNotifications = async (
  notificationIds?: string[],
): Promise<void> => {
  if (!notificationIds?.length) {
    return;
  }

  await Promise.all(
    notificationIds.map((notificationId) =>
      Notifications.cancelScheduledNotificationAsync(notificationId),
    ),
  );
};

export const sendTestNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Test Notification",
      body: "Task notifications are working.",
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      channelId: "task-reminders",
    },
  });
};
