import React, { useState } from "react";
import InputField from "../components/InputField";
import SendMessage from "../components/SendMessage.jsx";
import Button from "../components/Button";
import Icon from "../components/Icon.jsx";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = `${API_BASE.replace(/\/$/, "")}/emails/`;
const USER_API_URL = `${API_BASE.replace(/\/$/, "")}/user/`;

const CreateMessage = ({ user }) => {
  const navigate = useNavigate();

  const [receiverUsername, setReceiverUsername] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    if (!receiverUsername || receiverUsername.trim().length === 0) {
      setStatusMessage("Palun sisesta saaja kasutajanimi.");
      return;
    }
    if (!message || message.trim().length === 0) {
      setStatusMessage("Sõnum ei tohi olla tühi.");
      return;
    }
    if (message.length > 900) {
      setStatusMessage("Sõnum on liiga pikk. Maksimaalne pikkus on 900 tähemärki.");
      return;
    }

    if (!user || !user.id) {
      setStatusMessage("Kasutaja ei ole sisse logitud.");
      return;
    }

    setLoading(true);

    try {
      const userLookupResponse = await fetch(`${USER_API_URL}${receiverUsername}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!userLookupResponse.ok) {
        setStatusMessage(`Kasutajat "${receiverUsername}" ei leitud.`);
        setLoading(false);
        return;
      }

      const userData = await userLookupResponse.json();
      const receiverId = userData.user.id;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: receiverId,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage(`Kiri saadetud kasutajale ${receiverUsername}`);
        setReceiverUsername("");
        setMessage("");
      } else {
        if (data.message && data.message.toLowerCase().includes("not found")) {
          setStatusMessage(`Kasutajat "${receiverUsername}" ei leitud.`);
        } else {
          setStatusMessage(data.message || "Kirja saatmine ebaõnnestus.");
        }
      }
    } catch (error) {
      setStatusMessage("Viga võrguühenduses. Palun proovi uuesti.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <div style={{ alignSelf: "flex-start" }}>
        <Icon type="back" onClick={() => navigate("/main")} />
      </div>

      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
        <InputField
          label="Kellele"
          placeholder="Kirjuta sõbra kasutajanimi.."
          value={receiverUsername}
          onChange={setReceiverUsername}
        />
        {statusMessage && (
          <p style={{ margin: 0, color: statusMessage.includes("saadetud") ? "green" : "red" }}>
            {statusMessage}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", gap: "10px" }}>
        <SendMessage value={message} onChange={setMessage} />
        <Button onClick={handleSend} disabled={loading} style={{ backgroundColor: "#ef4444" }}>
          {loading ? "Saadan..." : "Saada"}
        </Button>
      </div>
    </div>
  );
};

export default CreateMessage;
