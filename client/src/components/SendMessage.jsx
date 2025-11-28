import React from "react";

const SendMessage = ({ value, onChange }) => {
  return (
    <div
      style={{
        // borderRadius: "10px",
        // border: "1px solid grey",
        padding: "10px",
        width: "auto",
        maxWidth: "600px",
      }}
    >
      <div
        style={{
          // borderRadius: "10px",
          // border: "1px solid grey",
          padding: "10px",
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        <label
          style={{
            whiteSpace: "nowrap",
            marginTop: "8px",
          }}
          htmlFor="messageInput"
        >
          Sõnumi sisu
        </label>
        {/* Siin on textarea mida sa tõenäoliselt otsid praegu <----------------- */}
        <textarea
          id="messageInput"
          type="textarea"
          placeholder="Kirjuta sõnum siia, juba sõber ootab..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            fontSize: "28px",
            width: "90%",
            marginLeft: "10px",
            marginRight: "10px",
            height: "300px",
            padding: "8px",
            marginTop: "5px",
            borderRadius: "5px",
            border: "1px solid grey",
            resize: "none", // prevents user from resizing the box
            overflowY: "auto", // vertical scroll if text exceeds height
            overflowX: "hidden", // no horizontal scroll
            whiteSpace: "pre-wrap", // wrap long lines normally (at spaces)
            wordWrap: "break-word", // prevents long words from overflowing
          }}
        />
      </div>
    </div>
  );
};
export default SendMessage;
