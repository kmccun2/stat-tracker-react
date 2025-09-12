import React, { createContext, useContext, ReactNode } from "react";

// Define the shape of the data context value
interface DataContextType {
  [key: string]: any; // Allow any data structure for flexibility
}

// Interface for provider props
interface DataProviderProps {
  children: ReactNode;
  value: DataContextType;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<DataProviderProps> = ({
  children,
  value,
}) => {
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export default DataContext;
