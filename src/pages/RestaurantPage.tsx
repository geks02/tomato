import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { IMenuItem, IRestaurant } from "../types";
import { restaurantService } from "../main";
import axios from "axios";
import RestaurantProfile from "../components/restaurantProfile";
import MenuItems from "../components/menuItems";

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchRestaurant = async () => {
    try {
      const { data } = await axios.get(
        `${restaurantService}/api/restaurant/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setRestaurant(data || null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchMenuItems = async () => {
    try {
      const { data } = await axios.get(
        `${restaurantService}/api/item/all/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setMenuItems(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchRestaurant();
      fetchMenuItems();
    }
  }, [id]);
  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center ">
        <p className="text-gray-500 ">Loading Restaurant... </p>
      </div>
    );
  }
  if (!restaurant) {
    return (
      <div className="flex h-[60vh] items-center justify-center ">
        <p className="text-gray-500 ">No Restaurant with this id </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 space-x-6">
      <RestaurantProfile
        restaurant={restaurant}
        onUpdate={setRestaurant}
        isSeller={false}
      />
      <div className="rounded-xl bg-white shadow-sm p-4">
        <MenuItems
          isSeller={false}
          items={menuItems}
          onItemDeleted={() => {}}
        />
      </div>
    </div>
  );
};

export default RestaurantPage;
