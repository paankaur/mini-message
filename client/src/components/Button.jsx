import React from "react";

const Button = ({ children, onClick, style, type = "button", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "fit-content",
        height: "fit-content",
        borderRadius: "8px",
        // border võtab index.css hover effecti maha
        padding: "0.6em 1.2em",
        fontSize: "1em",
        fontWeight: 500,
        fontFamily: "inherit",
        backgroundColor: "#1a1a1a",
        cursor: "pointer",
        transition: "border-color 0.25s",
        ...style, // allows overriding or adding styles from props
      }}
    >
      {children}
    </button>
  );
};

export default Button;