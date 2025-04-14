import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../data/interfaces";

interface UserState {
  user: User;
}

const initialState: UserState = {
  user: {
    username: "",
    bio: "",
    data_entrada: "",
    seguidores: "",
    seguindo: "",
  },
};

export const userSlice = createSlice({
  initialState,
  name: "users",
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
