import React, { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Icon from "../components/Icon.jsx";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000";

const Settings = ({ user }) => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!newPassword || !confirmPassword) {
      setError("Palun täida mõlemad parooli väljad.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Paroolid ei kattu.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Parool on liiga lühike. (Min 6 sümbolit).");
      return;
    }
    try {
      const userId = user?.id ?? user?.userId;
      const response = await fetch(`${API_URL}/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          newPassword: newPassword,
        }),
      });
      if (response.ok) {
        setMessage("Parool edukalt muudetud.");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        try {
          const errBody = await response.json();
          setError(errBody.message || "Parooli muutmine ebaõnnestus.");
        } catch (_) {
          setError("Parooli muutmine ebaõnnestus.");
        }
      }
    } catch (error) {
      setError("Midagi läks valesti. Palun proovi uuesti.");
    }
  };

  return (
    <div>
      {user ? (
        <>
          <div>
            <Icon type="back" onClick={() => navigate("/main")} />
          </div>

          <div>
            <p>Nimi : {user.name ?? user.username}</p>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            <InputField
              label="Uus parool"
              isPassword={true}
              value={newPassword}
              onChange={setNewPassword}
            />
            <InputField
              label="Kinnita uus parool"
              isPassword={true}
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
            <Button onClick={handleSave}>Salvesta</Button>
          </div>
        </>
      ) : (
        // Unauthenticated View
        <p>Palun logi sisse, et näha seadeid.</p>
      )}
    </div>
  );
};

export default Settings;
