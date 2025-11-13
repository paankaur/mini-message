import React from "react";

const InputField = ({ isPassword, label, value, onChange, placeholder }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: "10px",
      }}
    >
      {label && <label style={{ width: "105px" }}>{label}</label>}
      <input
        placeholder={placeholder}
        style={{
          marginLeft: "10px",
          borderRadius: "2px",
          border: "1px solid grey",
        }}
        type={isPassword ? "password" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default InputField;