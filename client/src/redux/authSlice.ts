import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: number;
  role: string;
  resume?: string;
  coverLetter?: string;
}

interface AuthState {
  user: AuthUser | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
