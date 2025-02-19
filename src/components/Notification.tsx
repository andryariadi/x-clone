"use client";

import { useEffect, useState } from "react";
import Image from "./Image";
import { socket } from "@/Socket";
import { useRouter } from "next/navigation";

type NotificationProps = {
  id: string;
  senderUsername: string;
  type: "like" | "comment" | "rePost" | "follow";
  link: string;
};

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    socket.on("getNotification", (data: NotificationProps) => {
      setNotifications((prev) => [...prev, data]);
    });
  }, []);

  const handleNotificationClick = (notification: NotificationProps) => {
    const filteredNotification = notifications.filter((notif) => notif.id !== notification.id);
    setNotifications(filteredNotification);

    setOpen(false);
    router.push(notification.link);
  };

  const reset = () => {
    setNotifications([]);
    setOpen(false);
  };

  return (
    <div className="b-amber-500 relative">
      <div className="p-2 rounded-full hover:bg-[#181818] transition-all duration-300 flex items-center gap-4 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="relative">
          <Image path={`icons/notification.svg`} alt="Notification" w={20} h={20} />

          {notifications.length > 0 && <div className="absolute -top-4 -right-4 bg-iconBlue w-6 h-6 rounded-full p-2 flex items-center justify-center text-sm">{notifications.length}</div>}
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
              {notif.type === "like" ? "liked your post" : notif.type === "rePost" ? "re-posted your post" : notif.type === "comment" ? "replied your post" : "follow you"}
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
