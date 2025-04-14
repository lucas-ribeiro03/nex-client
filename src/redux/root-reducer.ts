import { combineReducers } from "redux";
import { isLoggedSlice } from "./isLoggedReducer/isLogged-slice";
import { userSlice } from "./userReducer/user-slice";

export const rootReducer = combineReducers({
  isLoggedReducer: isLoggedSlice.reducer,
  useReducer: userSlice.reducer,
});

export type RootReducer = ReturnType<typeof rootReducer>;
