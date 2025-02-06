import { createSlice } from "@reduxjs/toolkit";

// Check if user is already logged in from localStorage
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

const initialState = {
  isLoggedIn: !!token,
  role: role || 'user'
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.role = 'user';
    },
    changeRole(state, action) {
      state.role = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
