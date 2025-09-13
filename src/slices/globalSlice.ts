// Redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ToastItemType {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "info";
}

export interface ErrorType {
  id: string;
  title: string;
  message: string;
}

export type GlobalState = {
  error: ErrorType | null;
  toastItems: ToastItemType[];
};

const initialState: GlobalState = {
  error: null,
  toastItems: [],
};

const teamsSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    // Reducer to show error message on an error page
    setError: (state, action: PayloadAction<ErrorType>) => {
      state.error = action.payload;
    },
    // Reducers related to toast errors
    addToastItem: (state, action: PayloadAction<ToastItemType>) => {
      const newItem: ToastItemType = {
        ...action.payload,
      };
      state.toastItems.push(newItem);
    },
    dismissToastItem: (state, action: PayloadAction<string>) => {
      state.toastItems = state.toastItems.filter(
        (item) => item.id !== action.payload
      );
    },
    clearAllToastItems: (state) => {
      state.toastItems = [];
    },
  },
});

export const { setError, addToastItem, dismissToastItem, clearAllToastItems } =
  teamsSlice.actions;
export default teamsSlice.reducer;
