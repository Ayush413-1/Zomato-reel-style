import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Userprofile.css";

const FoodPartnerProfile = () => {
  const [partner, setPartner] = useState({});
  const [restaurantLink, setRestaurantLink] = useState("");

  const getPartner = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/food-partner/me`,
        { withCredentials: true }
      );

      setPartner(res.data.foodPartner);
      setRestaurantLink(res.data.foodPartner.restaurantLink || "");
    } catch (err) {
      console.log(err);
    }
  };

  const saveRestaurantLink = async () => {
    try {
     const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/food-partner/me`,
        // { restaurantLink },
        { withCredentials: true }
      );
console.log(res.data);
      alert("Restaurant link saved successfully!");
    } catch (err) {
      console.log(err);
      alert("Failed to save link.");
    }
  };

  const logout = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/food-partner/logout`,
        { withCredentials: true }
      );

      window.location.href = "/food-partner/login";
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPartner();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
            </svg>
          </div>

          <div className="profile-details">
            <span className="profile-pill">Food Partner</span>

            <h2>{partner.name || "Restaurant Name"}</h2>

            <p>{partner.email || "restaurant@email.com"}</p>

            <p>{partner.phone}</p>

            <p>{partner.address}</p>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerProfile;