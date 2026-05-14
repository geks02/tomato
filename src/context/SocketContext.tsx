// import {
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   type ReactNode,
// } from "react";

// import { io, Socket } from "socket.io-client";
// import { useAppData } from "./AppContext";
// import { realtimeService } from "../main";

// interface SocketContextType {
//   socket: Socket | null;
// }

// const SocketContext = createContext<SocketContextType>({ socket: null });
// export const SocketProvider = ({ children }: { children: ReactNode }) => {
//   const { isAuth } = useAppData();
//   const socketRef = useRef<Socket | null>(null);
//   useEffect(() => {
//     if (!isAuth) {
//       socketRef.current?.disconnect();
//       socketRef.current = null;
//       return;
//     }
//     if (socketRef.current) {
//       return;
//     }
//     const socket = io(realtimeService, {
//       auth: {
//         token: localStorage.getItem("token"),
//       },
//       transports: ["websocket"],
//     });
//     socketRef.current = socket;
//     socket.on("connect", () => {
//       console.log("Socket Connected", socket.id);
//     });
//     socket.on("disconnect", () => {
//       console.log("Socket Disconnected", socket.id);
//     });
//     socket.on("connect_error", (err) => {
//       console.log("Socket Error:", err.message);
//     });
//     return () => {
//       socket.disconnect();
//       socketRef.current = null;
//     };
//   }, [isAuth]);
//   return (
//     <SocketContext.Provider value={{ socket: socketRef.current }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => useContext(SocketContext);


import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState, // ✅ FIX: Imported useState
  type ReactNode,
} from "react";

import { io, Socket } from "socket.io-client";
import { useAppData } from "./AppContext";
import { realtimeService } from "../main";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { isAuth } = useAppData();
  const socketRef = useRef<Socket | null>(null);
  const [activeSocket, setActiveSocket] = useState<Socket | null>(null); // ✅ FIX: Added state to trigger re-renders

  useEffect(() => {
    if (!isAuth) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setActiveSocket(null); // ✅ FIX: Clear state
      return;
    }
    if (socketRef.current) {
      return;
    }
    const socket = io(realtimeService, {
      auth: {
        token: localStorage.getItem("token"),
      },
      transports: ["websocket"],
    });
    
    socketRef.current = socket;
    setActiveSocket(socket); // ✅ FIX: Set state to update consumers like RiderDashboard

    socket.on("connect", () => {
      console.log("Socket Connected", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("Socket Disconnected", socket.id);
    });
    socket.on("connect_error", (err) => {
      console.log("Socket Error:", err.message);
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
      setActiveSocket(null); // ✅ FIX: Clean up state
    };
  }, [isAuth]);

  return (
    // ✅ FIX: Pass the active state, not the static ref
    <SocketContext.Provider value={{ socket: activeSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);