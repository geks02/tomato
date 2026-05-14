// import { useState, useEffect } from "react";
// import type { IOrder } from "../types";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import * as L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine";
// import axios from "axios";
// import { realtimeService } from "../main";

// declare module "leaflet" {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace Routing {
//     function control(options: any): any;
//     function osrmv1(options?: any): any;
//   }
// }

// const riderIcon = new L.DivIcon({
//   html: "🛵",
//   iconSize: [30, 30],
//   className: " ",
// });

// const deliveryIcon = new L.DivIcon({
//   html: "📦",
//   iconSize: [30, 30],
//   className: " ",
// });

// interface Props {
//   order: IOrder;
// }

// const Routing = ({
//   from,
//   to,
// }: {
//   from: [number, number];
//   to: [number, number];
// }) => {
//   const map = useMap();
//   useEffect(() => {
//     const control = L.Routing.control({
//       waypoints: [L.latLng(from), L.latLng(to)],
//       lineOptions: {
//         styles: [{ color: "#E23744", weight: 5 }],
//       },
//       addWaypoints: false,
//       draggableWaypoints: false,
//       show: false,
//       createMarker: () => null,
//       router: L.Routing.osrmv1({
//         serviceUrl: "https://router.project-osrm.org/route/v1",
//       }),
//     }).addTo(map);
//     return () => {
//       map.removeControl(control);
//     };
//   }, [from, to, map]);
//   return null;
// };

// const RiderOrderMap = ({ order }: Props) => {
//   const [riderLocation, setRiderLocation] = useState<[number, number] | null>(
//     null,
//   );

//   if (
//     order.deliveryAddress.latitude == null ||
//     order.deliveryAddress.longitude == null
//   ) {
//     return null;
//   }
//   const deliveryLocation: [number, number] = [
//     order.deliveryAddress.latitude,
//     order.deliveryAddress.longitude,
//   ];
//   // useEffect(() => {
//   //   const fetchLocation = () => {
//   //     navigator.geolocation.getCurrentPosition(
//   //       (pos) => {
//   //         const latitude = pos.coords.latitude;
//   //         const longitude = pos.coords.longitude;

//   //         setRiderLocation([latitude, longitude]);
//   //         axios.post(
//   //           `${realtimeService}/api/v1/internal/emit`,
//   //           {
//   //             event: "rider:location",
//   //             room: `user:${order.userId}`,
//   //             payload: { latitude, longitude },
//   //           },
//   //           {
//   //             headers: {
//   //               "x-internal-key": import.meta.env.VITE_INTERNAL_SERVICE_KEY,
//   //             },
//   //           },
//   //         );
//   //       },
//   //       (err) => console.log("Location Error:", err),
//   //       {
//   //         enableHighAccuracy: true,
//   //         maximumAge: 5000,
//   //         timeout: 10000,
//   //       },
//   //     );
//   //   };
//   //   fetchLocation();
//   //   const interval = setInterval(fetchLocation, 10000);
//   //   return () => {
//   //     clearInterval(interval);
//   //   };
//   // }, [order.userId]);

//   useEffect(() => {
//     const fetchLocation = () => {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const latitude = pos.coords.latitude;
//           const longitude = pos.coords.longitude;

//           setRiderLocation([latitude, longitude]);
//           axios.post(
//             `${realtimeService}/api/v1/internal/emit`,
//             {
//               event: "rider:location",
//               room: `user:${order.userId}`,
//               payload: { latitude, longitude },
//             },
//             {
//               headers: {
//                 "x-internal-key": import.meta.env.VITE_INTERNAL_SERVICE_KEY,
//               },
//             },
//           ).catch((err) => {
//              // ✅ FIX: Gracefully handle the 500 error so it doesn't break the app flow
//              console.log("Failed to emit location to internal service:", err.message);
//           });
//         },
//         (err) => console.log("Location Error:", err),
//         {
//           enableHighAccuracy: true,
//           maximumAge: 5000,
//           timeout: 10000,
//         },
//       );
//     };
//     fetchLocation();
//     const interval = setInterval(fetchLocation, 10000);
//     return () => {
//       clearInterval(interval);
//     };
//   }, [order.userId]);
//   if (!riderLocation) return null;

//   return (
//     <div className="rounded-xl bg-white shadow-sm p-3">
//       <MapContainer
//         center={riderLocation}
//         zoom={14}
//         className="h-87.5 w-full rounded-lg"
//       >
//         <TileLayer
//           attribution="&copy; OpenStreetMap"
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <Marker position={riderLocation} icon={riderIcon}>
//           <Popup>You (Rider)</Popup>
//         </Marker>
//         <Marker position={deliveryLocation} icon={deliveryIcon}>
//           <Popup>Delivery Location</Popup>
//         </Marker>
//         <Routing from={riderLocation} to={deliveryLocation} />
//       </MapContainer>
//     </div>
//   );
// };

// export default RiderOrderMap;

import { useState, useEffect } from "react";
import type { IOrder } from "../types";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// ✅ FIX 1: Changed import from '* as L' to default import to help Vite bundle the routing machine correctly
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import axios from "axios";
import { realtimeService } from "../main";

declare module "leaflet" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Routing {
    function control(options: any): any;
    function osrmv1(options?: any): any;
  }
}

const riderIcon = new L.DivIcon({
  html: "🛵",
  iconSize: [30, 30],
  className: " ",
});

const deliveryIcon = new L.DivIcon({
  html: "📦",
  iconSize: [30, 30],
  className: " ",
});

interface Props {
  order: IOrder;
}

const Routing = ({
  from,
  to,
}: {
  from: [number, number];
  to: [number, number];
}) => {
  const map = useMap();
  useEffect(() => {
    // ✅ FIX 2: Added a safety check. If Vite fails to attach Routing to L, we exit early instead of crashing the app with a white screen.
    if (!L || !L.Routing) {
      console.error("Leaflet Routing Machine failed to load properly.");
      return;
    }

    const control = L.Routing.control({
      waypoints: [L.latLng(from), L.latLng(to)],
      lineOptions: {
        styles: [{ color: "#E23744", weight: 5 }],
      },
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
      createMarker: () => null,
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
    }).addTo(map);
    
    return () => {
      map.removeControl(control);
    };
  }, [from, to, map]);
  return null;
};

const RiderOrderMap = ({ order }: Props) => {
  const [riderLocation, setRiderLocation] = useState<[number, number] | null>(
    null,
  );

  if (
    order.deliveryAddress.latitude == null ||
    order.deliveryAddress.longitude == null
  ) {
    return null;
  }
  
  const deliveryLocation: [number, number] = [
    order.deliveryAddress.latitude,
    order.deliveryAddress.longitude,
  ];

  useEffect(() => {
    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latitude = pos.coords.latitude;
          const longitude = pos.coords.longitude;

          setRiderLocation([latitude, longitude]);
          
          axios.post(
            `${realtimeService}/api/v1/internal/emit`,
            {
              event: "rider:location",
              room: `user:${order.userId}`,
              payload: { latitude, longitude },
            },
            {
              headers: {
                "x-internal-key": import.meta.env.VITE_INTERNAL_SERVICE_KEY,
              },
            },
          ).catch((err) => {
             // ✅ FIX 3: Handles the 403 Forbidden gracefully in the console. 
             // REMINDER: You MUST check your frontend .env file and ensure VITE_INTERNAL_SERVICE_KEY exists and matches the backend secret!
             console.log("Location Sync Blocked (403): Please check your VITE_INTERNAL_SERVICE_KEY in your .env file.", err.message);
          });
        },
        (err) => console.log("Location Error:", err),
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000,
        },
      );
    };
    
    fetchLocation();
    const interval = setInterval(fetchLocation, 10000);
    
    return () => {
      clearInterval(interval);
    };
  }, [order.userId]);

  if (!riderLocation) return null;

  return (
    <div className="rounded-xl bg-white shadow-sm p-3">
      <MapContainer
        center={riderLocation}
        zoom={14}
        className="h-87.5 w-full rounded-lg"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={riderLocation} icon={riderIcon}>
          <Popup>You (Rider)</Popup>
        </Marker>
        <Marker position={deliveryLocation} icon={deliveryIcon}>
          <Popup>Delivery Location</Popup>
        </Marker>
        <Routing from={riderLocation} to={deliveryLocation} />
      </MapContainer>
    </div>
  );
};

export default RiderOrderMap;