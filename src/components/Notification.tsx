"use client";

import { useEffect, useState } from "react";
import Image from "./Image";
import { socket } from "@/Socket";
import { useRouter } from "next/navigation";

type NotificationProps = {
  id: string;
  senderUsername: string;
  type: "like" | "comment" | "rePost" | "follow" | "save";
  link: string;
};

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  // Fungsi untuk menyimpan notifikasi ke localStorage
  const saveNotificationsToLocalStorage = (notifications: NotificationProps[]) => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  };

  // Fungsi untuk mengambil notifikasi dari localStorage
  const getNotificationsFromLocalStorage = (): NotificationProps[] => {
    const storedNotifications = localStorage.getItem("notifications");
    return storedNotifications ? JSON.parse(storedNotifications) : [];
  };

  // Saat komponen pertama kali di-mount, ambil notifikasi dari localStorage
  useEffect(() => {
    const storedNotifications = getNotificationsFromLocalStorage();
    setNotifications(storedNotifications);
  }, []);

  // Dengarkan event "getNotification" dari socket
  useEffect(() => {
    const handleNotification = (data: NotificationProps) => {
      const updatedNotifications = [...notifications, data];

      setNotifications(updatedNotifications);
      saveNotificationsToLocalStorage(updatedNotifications); // Simpan ke localStorage
    };

    socket.on("getNotification", handleNotification);

    // Bersihkan listener saat komponen di-unmount
    return () => {
      socket.off("getNotification", handleNotification);
    };
  }, [notifications]);

  // Handle klik notifikasi
  const handleNotificationClick = (notification: NotificationProps) => {
    const filteredNotifications = notifications.filter((notif) => notif.id !== notification.id);

    setNotifications(filteredNotifications);
    saveNotificationsToLocalStorage(filteredNotifications); // Update localStorage

    setOpen(false);
    router.push(notification.link);
  };

  // Reset notifikasi (mark as read)
  const reset = () => {
    setNotifications([]);
    saveNotificationsToLocalStorage([]); // Hapus semua notifikasi dari localStorage

    setOpen(false);
  };

  return (
    <div className="relative">
      <div className="p-2 rounded-full hover:bg-[#181818] transition-all duration-300 flex items-center gap-4 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="relative">
          <Image path={`icons/notification.svg`} alt="Notification" w={20} h={20} />

          {notifications.length > 0 && <div className="absolute -top-3 -right-2 bg-iconBlue w-5 h-5 rounded-full p-2 flex items-center justify-center text-xs">{notifications.length}</div>}
        </div>
        <span className="hidden xxl:inline text-base">Notifications</span>
      </div>

      {/* Notification */}
      {open && (
        <div className="absolute -right-full bg-white w-max p-4 rounded-lg flex flex-col gap-3">
          <h1 className="text-lg text-textGray">Notifications</h1>

          {notifications.map((notif) => (
            <div key={notif.id} className="cursor-pointer text-black" onClick={() => handleNotificationClick(notif)}>
              <b> {notif.senderUsername}</b> {""}
              {notif.type === "like" ? "liked your post" : notif.type === "rePost" ? "re-posted your post" : notif.type === "comment" ? "replied your post" : notif.type === "save" ? "saved your post" : "followed you"}
            </div>
          ))}

          <button onClick={reset} className="bg-black text-white text-sm p-2 rounded-lg">
            Mark as read
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;
