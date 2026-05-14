import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppProvider } from "./context/AppContext.tsx";
import "leaflet/dist/leaflet.css";
import { SocketProvider } from "./context/SocketContext.tsx";
export const authService = "https://tomato-auth-jlck.onrender.com";
export const restaurantService = "https://restaurant-service-nqpj.onrender.com";
export const utilsService = "https://tomato-utils-85pd.onrender.com";
export const realtimeService = "https://realtime-service-1yji.onrender.com";
export const riderService = "https://rider-service-8p36.onrender.com";
export const adminService = "https://tomato-admin-b7kn.onrender.com";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="648193587740-akpsi30rk0u7f8trq6jijg14ffd14nvh.apps.googleusercontent.com">
    <AppProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AppProvider>
  </GoogleOAuthProvider>,
);
