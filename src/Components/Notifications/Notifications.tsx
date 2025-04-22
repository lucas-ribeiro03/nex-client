/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";

interface Notification {
  id: string;
  isRead: boolean;
  notificationType: string;
  sender: {
    username: string;
  };
  postId?: string;
}

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getNotifications = async () => {
      const response = await axios.get(`${apiUrl}/notifications`, {
        headers: { accessToken: localStorage.getItem("token") },
      });

      setNotifications(response.data);
    };
    getNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    await axios
      .put(
        `${apiUrl}/notifications/:id`,
        { id },
        { headers: { accessToken: localStorage.getItem("token") } }
      )
      .then();
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  return (
    <div className={styles.body}>
      <div className={styles.notificationContainer}>
        {notifications.map((notification, index) => (
          <div className={styles.notificationItem} key={index}>
            {notification.notificationType === "follow"
              ? `${notification.sender.username} seguiu você`
              : notification.notificationType === "like"
              ? `${notification.sender.username} curtiu seu post`
              : notification.notificationType === "comment"
              ? `${notification.sender.username} comentou: `
              : null}
            <div className={styles.read}>
              {notification.isRead ? (
                "Lida"
              ) : (
                <FaCheckCircle onClick={() => markAsRead(notification.id)} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
