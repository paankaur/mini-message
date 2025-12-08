import React, { useState, useEffect } from "react";
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
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || !user.id) {
      setHasUnreadMessages(false);
      setUnreadCount(0);
      return;
    }

    const checkUnreadMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/emails/inbox/${user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          const unreadEmails = data.emails
            ? data.emails.filter((email) => email.unread === true)
            : [];
          setUnreadCount(unreadEmails.length);
          setHasUnreadMessages(unreadEmails.length > 0);
        }
      } catch (error) {
        console.error("Error checking unread messages:", error);
      }
    };

    checkUnreadMessages();
  }, [user]);

  return (
    <div>
      {user ? (
        // Authenticated View (UserScreen Logic)

        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Icon type="back" onClick={() => navigate("/")} />
            <Icon type="settings" onClick={() => navigate("/settings")} />
          </div>

          <h2>Tere, {user.username}!</h2>
          <Icon type="settings" onClick={() => navigate("/settings")} />
          <h2>Tere, {user.name ?? user.username}!</h2>
          {notifications.length > 0 && (
            <div style={{ background: "#fde68a", padding: "6px", borderRadius: "4px" }}>
              <strong>{notifications.length}</strong> uus teadete
            </div>
          )}
          <p>Mis toimub?</p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <Button
              style={{ height: "600px", width: "180px" }}
              onClick={() => navigate("/create-message")}
            >
              Kirjuta
            </Button>
            <div style={{ position: "relative" }}>
              <Button
                style={{
                  height: "600px",
                  width: "180px",
                  ...(hasUnreadMessages && { border: "2px solid #10b918ff" }),
                }}
                onClick={() => navigate("/read-message")}
              >
                Loe
              </Button>
              {unreadCount > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    // backgroundColor: "#10b918ff",
                    color: "#10b918ff",
                    //  borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "16px",
                    pointerEvents: "none",
                  }}
                >
                  +{unreadCount}
                </div>
              )}
            </div>
          </div>
          <Button
            onClick={handleLogout}
            style={{ backgroundColor: "#ef4444" }}
            type="button"
          >
            Logi välja
          </Button>
        </>
      ) : (
        // Unauthenticated View
        <>
          <h2>Avaleht</h2>
          <p>Palun logi sisse või registreeru, et jätkata.</p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Link to="/">Logi sisse</Link>
            <Link to="/register">Registreeru</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default UserScreen;
