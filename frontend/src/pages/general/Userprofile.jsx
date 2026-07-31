import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Userprofile.css";

const UserProfile = () => {
  const [user, setUser] = useState({});

  const getUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        { withCredentials: true }
      );

      setUser(res.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    await axios.get(
      `${import.meta.env.VITE_API_URL}/api/auth/user/logout`,
      { withCredentials: true }
    );

    window.location.href = "/user/login";
  };

  useEffect(() => {
    const loadProfile = async () => {
      await getUser();
    };

    loadProfile();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar" aria-label="User avatar">
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
            <span className="profile-pill">My Account</span>
            <h2>{user.fullName || "User Name"}</h2>
            <p>{user.email || "your@email.com"}</p>

            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default UserProfile;