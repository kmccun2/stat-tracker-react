import { Dropdown } from "react-bootstrap";
import { LumexDropdownProps, OptionType } from "./LumexDropdownTypes";
import "./LumexDropdown.scss";
import { useState } from "react";
import { MdClose, MdOutlineKeyboardArrowDown, MdSearch } from "react-icons/md";

const LumexDropdown = ({ props }: { props: LumexDropdownProps }) => {
  // Descructure props
  const { options, placeholder, multiSelect, selectAll, setOptions } = props;

  // Utils
  const filterOptions = (options: OptionType[], search: string) => {
    if (!search) return options;
    return options.filter((o) => o.label?.toLowerCase().includes(search.toLowerCase()));
  };

  const getFormValue = () => {
    if (!options.some((o) => o.selected)) return placeholder || "Select...";
    if (options.filter((o) => o.selected).length > 1)
      return options
        .filter((o) => o.selected)
        .map((o) => o.label)
        .join(", ");
    return options.filter((o) => o.selected)[0].label;
  };

  // Local state
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [sliceValue, setSliceValue] = useState<number>(100);

  // Event handlers
  const handleChangeSearch = (value: string) => {
    // Update local state of searchText
    setSearchText(value);
    setSliceValue(100);
  };

  const handleSelectOption = (option: OptionType) => {
    // Clear search text
    setSearchText("");
    let _options = options.map((o) => (o.value === option.value ? { ...o, selected: !o.selected } : o));
    setOptions(_options);
  };

  const handleSelectAll = () => {
    let _options = options.map((o) => ({ ...o, selected: false }));
    if (options.some((o) => !o.selected)) {
      _options = options.map((o) => ({ ...o, selected: true }));
    }
    setOptions(_options);
  };

  const handleInfinityScroll = (container: any, sliceValue: number, setSliceValue: any) => {
    let height = container.target.clientHeight;
    let scrollHeight = container.target.scrollHeight;
    let fromTop = container.target.scrollTop;

    // If user scrolls to end of container, add more values to the end
    if (scrollHeight - height - 50 < fromTop) {
      setSliceValue(sliceValue + 25);
    }
    return;
  };

  return (
    <Dropdown bsPrefix="dropdown audit-dd" onToggle={() => setIsOpen(!isOpen)} autoClose="outside">
      {/* Dropdown toggle section */}
      <Dropdown.Toggle
        bsPrefix={`audit-dd-toggle form-select-sm d-flex align-items-center bg-white border text-dark w-100 p-0 px-2 py-1`}
      >
        <div className="flex-grow-1 d-flex overflow-hidden text-nowrap">{getFormValue()}</div>
        <span className="dropdown-icon-container d-flex align-items-center justify-content-center">
          <MdOutlineKeyboardArrowDown size={20} className={`dropdown-icon ${isOpen ? "flipped" : ""}`} />
        </span>
      </Dropdown.Toggle>

      {/* Dropdown menu section */}
      <Dropdown.Menu
        bsPrefix="dropdown-menu bg-white pt-0"
        onScroll={(e) => handleInfinityScroll(e, sliceValue, setSliceValue)}
      >
        {/* Search box */}
        <div className="search-container position-sticky bg-white d-flex border-bottom align-items-center justify-content-start p-2 m-0">
          <MdSearch size={18} />
          <input
            className="filter-input search-input border-0 flex-grow-1"
            spellCheck="false"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => handleChangeSearch(e.target.value)}
          ></input>
          <MdClose className="clear-search" size={"1.2rem"} onClick={() => handleChangeSearch("")} />
        </div>

        {/* Dropdown items */}
        {filterOptions(options, searchText).length > 0 ? (
          <>
            {/* Select all option */}
            {selectAll && (
              <Dropdown.Item bsPrefix="dropdown-item d-flex justify-content-between" onClick={() => handleSelectAll()}>
                {multiSelect && <input type="checkbox" checked={!options.some((o) => !o.selected)} className="me-2" />}
                <div className="flex-grow-1">Select All</div>
              </Dropdown.Item>
            )}

            {/* Options */}
            {filterOptions(options, searchText)
              .slice(0, sliceValue)
              .map((e) => (
                <Dropdown.Item
                  bsPrefix="dropdown-item d-flex justify-content-between"
                  onClick={() => handleSelectOption(e)}
                >
                  {multiSelect && (
                    <input
                      type="checkbox"
                      checked={options.some((o) => o.value === e.value && o.selected)}
                      className="me-2"
                    />
                  )}
                  <div className="flex-grow-1">{e.label}</div>
                </Dropdown.Item>
              ))}
          </>
        ) : (
          <div className="d-flex justify-content-center p-5 text-perf-light">No results based on search</div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LumexDropdown;
