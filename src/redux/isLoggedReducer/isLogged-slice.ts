import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("token")
  ? {
      isLogged: true,
    }
  : {
      isLogged: false,
    };

export const isLoggedSlice = createSlice({
  initialState,
  name: "isLogged",
  reducers: {
    saveLogin: (state, action) => {
      state.isLogged = action.payload;
    },
  },
});

export const { saveLogin } = isLoggedSlice.actions;
