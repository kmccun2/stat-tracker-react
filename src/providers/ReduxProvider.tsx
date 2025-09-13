// React
import React from 'react';

// Redux
import { Provider } from 'react-redux';
import { store } from '../utils/store';

interface ReduxProviderProps {
  children: React.ReactNode;
}

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
