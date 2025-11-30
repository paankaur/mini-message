import React, { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError("Palun täida kõik väljad");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // server returns { message, user: { id, name } }
        const serverUser = data.user || {};
        const userData = {
          id: serverUser.id,
          name: serverUser.name || username,
          username: serverUser.name || username,
          token: data.token || "mock_auth_token",
        };
        setUser(userData);
        navigate("/main");
      } else {
        setError( "Sisselogimine ebaõnnestus");
      }
    } catch (error) {
      setError("Sisselogimine ebaõnnestus");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleLoginSubmit}>
      <InputField
        label="Kasutajanimi"
        placeholder="Sisesta oma kasutajanimi"
        value={username}
        onChange={setUsername}
      />
      <InputField
        label="Parool"
        placeholder="Sisesta oma parool"
        value={password}
        onChange={setPassword}
        isPassword
      />

      {error && <p>{error}</p>}

      <Button type="submit" style={{ backgroundColor: "red" }} disabled={loading}>
        Logi sisse
      </Button>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div style={{ width: "100%", height: "2px", backgroundColor: "black" }}></div>
          <p>VÕI REGISTREERU</p>
          <div style={{ width: "100%", height: "2px", backgroundColor: "black" }}></div>
        </div>
        <Button
          style={{ backgroundColor: "gray" }}
          onClick={() => navigate("/register")}
          type="button"
        >
          Registreeru
        </Button>
      </div>
    </form>
  );
};

export default Login;
