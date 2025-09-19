export interface LumexDropdownProps {
  options: OptionType[];
  label: string;
  placeholder?: string;
  searchable?: boolean;
  multiSelect?: boolean;
  selectAll?: boolean;
  setOptions: (option: OptionType[]) => void;
}

export type OptionType = {
  value: string | number;
  label: string;
  selected?: boolean;
};
