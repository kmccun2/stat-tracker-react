import "./TableCardToggle.scss";

import { useState } from "react";
import { HiOutlineViewGrid, HiOutlineViewList } from "react-icons/hi";

const TableCardToggle = () => {
  const [View, setView] = useState<"cards" | "table">("cards");

  return (
    <div className="toggle-container">
      <div
        className={`toggle-option ${View === "table" ? "active" : ""}`}
        onClick={() => setView("table")}
      >
        <HiOutlineViewList className="icon" />
      </div>
      <div
        className={`toggle-option ${View === "cards" ? "active" : ""}`}
        onClick={() => setView("cards")}
      >
        <HiOutlineViewGrid className="icon" />
      </div>
    </div>
  );
};

export default TableCardToggle;
