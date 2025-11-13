import "./App.css";
import SendMessage from "./components/SendMessage.jsx";
import InputField from "./components/InputField.jsx";
import Button from "./components/Button.jsx";
import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");

  const handleSubmit = () => {
    console.log("Submitted:", { username, password, message, recipient });
    setUsername("");
    setPassword("");
    setMessage("");
    setRecipient("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "400px",
      }}
    >
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
      <InputField
        label="Saaja"
        placeholder="Sisesta sõbra kasutajanimi"
        value={recipient}
        onChange={setRecipient}
      />
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          gap: "10px",
          width: "800px",
        }}
      >
        <SendMessage value={message} onChange={setMessage} />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
}

export default App;
