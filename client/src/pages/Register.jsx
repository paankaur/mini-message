import React, { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Icon from "../components/Icon.jsx";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!username || !password || !confirmPassword) {
      setError("Palun täida kõik väljad");
      return;
    }
    if (password !== confirmPassword) {
      setError("Paroolid ei kattu");
      return;
    }

    if (password.length < 6) {
      setError(`Parool on liiga lühike.(Min 6 sümbolit).`);
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registreerimine õnnestus! Palun logi sisse.");
        navigate("/");
      } else {
        const errorMessage = data.message || "";

        if (
          errorMessage.toLowerCase().includes("exists") ||
          errorMessage.toLowerCase().includes("kasutusel")
        ) {
          setError("Kasutajanimi on juba olemas.");
        } else if (errorMessage.toLowerCase().includes("short")) {
          setError(`Parool on liiga lühike (min 6 sümbolit).`);
        } else {
          setError("Registreerimine ebaõnnestus. Proovi uuesti.");
        }
      }
    } catch (error) {
      setError("Registreerimine ebaõnnestus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Icon type="back" onClick={() => navigate("/")} />
    <form onSubmit={handleRegisterSubmit}>
      <InputField
        label="Kasutajanimi"
        placeholder="Sisesta kasutajanimi"
        value={username}
        onChange={setUsername}
      />
      <InputField
        label="Parool"
        isPassword
        placeholder="Sisesta parool"
        value={password}
        onChange={setPassword}
      />
      <InputField
        label="Kinnita parool"
        isPassword
        placeholder="Kinnita parool"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />

        {error && <p>{error}</p>}
        {message && <p>{message}</p>}

      <Button type="submit" style={{ backgroundColor: "red" }} disabled={loading}>
        Registreeru
      </Button>
    </form>
    </>
  );
};

export default Register;
