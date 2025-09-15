import "./TableCardToggle.scss";

import { HiOutlineViewGrid, HiOutlineViewList } from "react-icons/hi";

type TableCardToggleProps = {
  view: "cards" | "table";
  setView: (view: "cards" | "table") => void;
};
const TableCardToggle: React.FC<TableCardToggleProps> = ({
  view: View,
  setView,
}) => {
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
