import {
  createContext,
  useContext,
  useEffect,
  useRef,
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
  useEffect(() => {
    if (!isAuth) {
      socketRef.current?.disconnect();
      socketRef.current = null;
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
    };
  }, [isAuth]);
  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
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
//   const [socket, setSocket] = useState<Socket | null>(null);

//   useEffect(() => {
//     if (!isAuth) {
//       setSocket((prevSocket) => {
//         prevSocket?.disconnect();
//         return null;
//       });
//       return;
//     }

//     const newSocket = io(realtimeService, {
//       auth: {
//         token: localStorage.getItem("token"),
//       },
//       transports: ["websocket"],
//     });

//     setSocket(newSocket);

//     newSocket.on("connect", () => {
//       console.log("Socket Connected", newSocket.id);
//     });

//     newSocket.on("disconnect", () => {
//       console.log("Socket Disconnected", newSocket.id);
//     });

//     newSocket.on("connect_error", (err) => {
//       console.log("Socket Error:", err.message);
//     });

//     return () => {
//       newSocket.disconnect();
//       setSocket(null);
//     };
//   }, [isAuth]);

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => useContext(SocketContext);

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
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
  
//   // CHANGED: Use state instead of ref so React re-renders when the socket connects
//   const [activeSocket, setActiveSocket] = useState<Socket | null>(null);

//   useEffect(() => {
//     // If not authenticated, clean up existing socket
//     if (!isAuth) {
//       if (activeSocket) {
//         activeSocket.disconnect();
//         setActiveSocket(null);
//       }
//       return;
//     }

//     // Prevent duplicate connections
//     if (activeSocket) {
//       return;
//     }

//     const socket = io(realtimeService, {
//       auth: {
//         token: localStorage.getItem("token"),
//       },
//       transports: ["websocket"],
//     });

//     // Update state to trigger a re-render and pass the socket to context
//     setActiveSocket(socket);

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
//       setActiveSocket(null);
//     };
//   }, [isAuth, activeSocket]); 

//   return (
//     // The provider now reacts to the state change
//     <SocketContext.Provider value={{ socket: activeSocket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => useContext(SocketContext);