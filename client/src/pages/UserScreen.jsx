import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import { useNavigate } from "react-router-dom";

const UserScreen = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <div>
      {user ? (
        // Authenticated View (UserScreen Logic)

        <>
          <Icon type="settings" onClick={() => navigate("/settings")} />
          <h2>Tere, {user.username}!</h2>
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
