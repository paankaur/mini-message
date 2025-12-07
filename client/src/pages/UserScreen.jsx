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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Icon type="back" onClick={() => navigate("/")} />
            <Icon type="settings" onClick={() => navigate("/settings")} />
          </div>

          <h2>Tere, {user.username}!</h2>
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
            <Button
              style={{ height: "600px", width: "180px" }}
              onClick={() => navigate("/create-message")}
            >
              Loe
            </Button>
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
