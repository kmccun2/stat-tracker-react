// Redux
import { configureStore } from '@reduxjs/toolkit';
import globalReducer from '../slices/globalSlice';

export const store = configureStore({
  reducer: {
    global: globalReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
