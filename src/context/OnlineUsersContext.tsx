"use client";

import { socket } from "@/Socket";
import { useUser } from "@clerk/nextjs";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Tipe data untuk pengguna online
type OnlineUser = {
  username: string;
  socketId: string;
};

// Tipe data untuk context
type OnlineUsersContextType = {
  onlineUsers: OnlineUser[];
};

// Buat context dengan nilai default
const OnlineUsersContext = createContext<OnlineUsersContextType>({
  onlineUsers: [],
});

// Props untuk provider
type OnlineUsersProviderProps = {
  children: ReactNode;
};

export const OnlineUsersProvider = ({ children }: OnlineUsersProviderProps) => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const { user } = useUser();

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });

      if (user) {
        socket.emit("newUser", user?.username);
      }

      socket.on("userOnline", (users: OnlineUser[]) => {
        console.log("Received userOnline:", users);
        setOnlineUsers(users);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("userOnline");
    };
  }, [user]);

  return <OnlineUsersContext.Provider value={{ onlineUsers }}>{children}</OnlineUsersContext.Provider>;
};

// Hook kustom untuk menggunakan context
export const useOnlineUsers = () => {
  return useContext(OnlineUsersContext);
};
