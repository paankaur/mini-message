import "./App.css";
import { useState, useEffect } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateMessage from "./pages/CreateMessage.jsx";
import ReadMessage from "./pages/ReadMessage.jsx";
import { Routes, Route } from "react-router-dom";
import UserScreen from "./pages/UserScreen.jsx";
import Settings from "./pages/Settings.jsx";
import { useNavigate } from "react-router-dom";
function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("auth_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <div
      style={{
        border: "1px solid grey",
        borderRadius: "10px",
        padding: "20px",
        margin: "20px auto",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "400px",
      }}
    >
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<UserScreen user={user} handleLogout={handleLogout} />} />
        <Route path="/settings" element={<Settings user={user} />} />
        <Route path="/create-message" element={<CreateMessage user={user} />} />
        <Route path="/read-message" element={<ReadMessage user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
