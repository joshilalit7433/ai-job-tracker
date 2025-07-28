import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/models";



interface AuthState {
  user: User | null;
  justLoggedOut: boolean;
}

const initialState: AuthState = {
  user: null,
  justLoggedOut: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.justLoggedOut = true;
    },
    clearJustLoggedOut: (state) => {
      state.justLoggedOut = false;
    }
  },
});

export const { setUser, logout,clearJustLoggedOut } = authSlice.actions;
export default authSlice.reducer;
