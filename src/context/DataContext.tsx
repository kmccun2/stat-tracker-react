// React hooks and context API for state management
import React, { createContext, useContext, ReactNode } from "react";

/**
 * Data context type definition
 * Provides a flexible structure for application data state
 * including players, assessments, goals, and CRUD operations
 */
interface DataContextType {
  [key: string]: any; // Allow any data structure for flexibility
}

/**
 * Provider component props interface
 * Defines the structure for passing data and children to the provider
 */
interface DataProviderProps {
  children: ReactNode;
  value: DataContextType;
}

// Create the data context with undefined default value
const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * DataProvider Component
 *
 * Wraps the application to provide data context to all child components.
 * Accepts a value prop containing all application state and methods.
 */
export const DataProvider: React.FC<DataProviderProps> = ({
  children,
  value,
}) => {
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

/**
 * useData Hook
 *
 * Custom hook to access the data context from any component.
 * Throws an error if used outside of a DataProvider.
 *
 * @returns DataContextType - The complete data context object
 * @throws Error if used outside DataProvider
 */
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export default DataContext;
