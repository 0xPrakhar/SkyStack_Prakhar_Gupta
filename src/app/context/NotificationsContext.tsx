import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  href?: string;
  createdAt: string;
  readAt?: string;
}

interface NotificationInput {
  title: string;
  body: string;
  href?: string;
}

interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  pushNotification: (notification: NotificationInput) => AppNotification;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (notificationId: string) => void;
}

const MAX_NOTIFICATIONS = 20;
const NotificationsContext = createContext<NotificationsContextValue | undefined>(
  undefined,
);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const storageKey = `eventify:notifications:${user?.id ?? "guest"}`;
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const rawNotifications = window.localStorage.getItem(storageKey);

      if (!rawNotifications) {
        setNotifications([]);
        return;
      }

      const parsedNotifications = JSON.parse(rawNotifications);
      setNotifications(
        Array.isArray(parsedNotifications)
          ? parsedNotifications.slice(0, MAX_NOTIFICATIONS)
          : [],
      );
    } catch (_error) {
      setNotifications([]);
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(notifications));
  }, [notifications, storageKey]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.readAt).length,
    [notifications],
  );

  function pushNotification(input: NotificationInput) {
    const notification = {
      id: crypto.randomUUID(),
      title: input.title,
      body: input.body,
      href: input.href,
      createdAt: new Date().toISOString(),
    };

    setNotifications((currentNotifications) => [
      notification,
      ...currentNotifications,
    ].slice(0, MAX_NOTIFICATIONS));

    return notification;
  }

  function markNotificationRead(notificationId: string) {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId && !notification.readAt
          ? {
              ...notification,
              readAt: new Date().toISOString(),
            }
          : notification,
      ),
    );
  }

  function markAllNotificationsRead() {
    const timestamp = new Date().toISOString();

    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.readAt
          ? notification
          : {
              ...notification,
              readAt: timestamp,
            },
      ),
    );
  }

  function dismissNotification(notificationId: string) {
    setNotifications((currentNotifications) =>
      currentNotifications.filter((notification) => notification.id !== notificationId),
    );
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        pushNotification,
        markNotificationRead,
        markAllNotificationsRead,
        dismissNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider.");
  }

  return context;
}
