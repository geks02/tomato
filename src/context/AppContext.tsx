import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authService, restaurantService } from "../main";
import {
  type ICart,
  type AppContextType,
  type LocationData,
  type User,
} from "../types";
import { Toaster } from "react-hot-toast";

const AppContext = createContext<AppContextType | undefined>(undefined);
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState<LocationData | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [city, setCity] = useState("Fetching Location");

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${authService}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const [cart, setCart] = useState<ICart[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [quantity, setQuantity] = useState(0);

  async function fetchCart() {
    if (!user || user.role !== "customer") return;
    try {
      const { data } = await axios.get(`${restaurantService}/api/cart/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart(data.cart || []);
      setSubTotal(data.subTotal || 0);
      setQuantity(data.cartLength || 0);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    if (user && user.role === "customer") {
      fetchCart();
    }
  }, [user]);

  // useEffect(() => {
  //   if (!navigator.geolocation) {
  //     return alert("Please Allow Location to Continue");
  //   }
  //   setLoadingLocation(true);

  //   navigator.geolocation.getCurrentPosition(async (position) => {
  //     const { latitude, longitude } = position.coords;

  //     try {
  //       const res = await fetch(
  //           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
  //         );
  //       const data = await res.json();
  //       setLocation({
  //         latitude,
  //         longitude,
  //         formattedAddress: data.display_name || "current location",
  //       });
  //       setCity(
  //         data.address.city ||
  //           data.address.town ||
  //           data.address.village ||
  //           "Your Location",
  //       );
  //     } catch (error) {
  //       setLocation({
  //         latitude,
  //         longitude,
  //         formattedAddress: "Current Location",
  //       });
  //       setCity("Failed to load");
  //     }finally {
  //         // FIX: Added finally block to ensure loading state is turned off
  //         setLoadingLocation(false);
  //   });
  // }, []);
  useEffect(() => {
    if (!navigator.geolocation) {
      setCity("Location not supported");
      return alert("Please Allow Location to Continue");
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // FIX: Changed "latitude" and "longitude" to "lat" and "lon" per Nominatim API docs
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );

          if (!res.ok) throw new Error("Failed to fetch address");

          const data = await res.json();

          setLocation({
            latitude,
            longitude,
            formattedAddress: data.display_name || "Current Location",
          });

          setCity(
            data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              "Your Location",
          );
          setLoadingLocation(false);
        } catch (error) {
          console.error("Geocoding error:", error);
          setLocation({
            latitude,
            longitude,
            formattedAddress: "Current Location",
          });
          setCity("Failed to load city");
          setLoadingLocation(false);
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation permission error:", error);
        setCity("Location Access Denied");
        setLoadingLocation(false);
      },
    );
  }, []);
  return (
    <AppContext.Provider
      value={{
        isAuth,
        loading,
        setIsAuth,
        setLoading,
        setUser,
        user,
        location,
        loadingLocation,
        city,
        cart,
        fetchCart,
        quantity,
        subTotal,
      }}
    >
      {children}
      <Toaster />
    </AppContext.Provider>
  );
};

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be used with an AppProvider");
  }
  return context;
};
