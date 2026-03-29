import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

/**
 * useSocket — real-time Socket.io connection to the AutoReel backend.
 * Exposes `lastUpdate` (the last received job event) so Dashboard can apply it.
 *
 * Events received:
 *   job:update   { jobId, status, output? }
 *   job:progress { jobId, percent, currentStep, stepIndex, stepTotal }
 *   job:youtube  { jobId, url }
 */
export function useSocket() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
      setConnected(false);
    });

    socket.on("job:update", (data) => {
      console.log("📡 job:update", data);
      setLastUpdate({ type: "update", ...data, ts: Date.now() });
    });

    socket.on("job:progress", (data) => {
      setLastUpdate({ type: "progress", ...data, ts: Date.now() });
    });

    socket.on("job:youtube", (data) => {
      console.log("📡 job:youtube", data);
      setLastUpdate({ type: "youtube", ...data, ts: Date.now() });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { connected, lastUpdate };
}
