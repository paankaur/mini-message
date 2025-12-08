import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import { useNavigate } from "react-router-dom";

import { connectSocket, getSocket } from "../utils/socket";

const UserScreen = ({ user, handleLogout }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;
    const socket = connectSocket("http://localhost:3000", user.id);
    const handler = (payload) => {
      setNotifications((n) => [payload, ...n]);
    };
    socket.on("new_email", handler);
    return () => {
      socket.off("new_email", handler);
    };
  }, [user]);
  const navigate = useNavigate();

  return (
    <div>
      {user ? (
        // Authenticated View (UserScreen Logic)

        <>
          <Icon type="settings" onClick={() => navigate("/settings")} />
          <h2>Tere, {user.name ?? user.username}!</h2>
          {notifications.length > 0 && (
            <div style={{ background: "#fde68a", padding: "6px", borderRadius: "4px" }}>
              <strong>{notifications.length}</strong> uus teadete
            </div>
          )}
          <p>Mis toimub?</p>
          <Button onClick={handleLogout} style={{ backgroundColor: "#ef4444" }} type="button">
            Logi välja
          </Button>
        </>
      ) : (
        // Unauthenticated View
        <>
          <h2>Avaleht</h2>
          <p>Palun logi sisse või registreeru, et jätkata.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link to="/">Logi sisse</Link>
            <Link to="/register">Registreeru</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default UserScreen;
