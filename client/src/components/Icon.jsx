import React from "react";
import { GoGear } from "react-icons/go";
import { IoMdArrowBack } from "react-icons/io";

const Icon = ({ type, onClick }) => {
  return (
    <button
      style={{
        width: "fit-content",
      }}
      onClick={onClick}
    >
      {type === "back" ? <IoMdArrowBack /> : <GoGear />}
    </button>
  );
};

export default Icon;
