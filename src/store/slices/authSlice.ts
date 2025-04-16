import { User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TAuthState = {
  authUser: User | null;
};

const initialState: TAuthState = {
  authUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<User>) => {
      state.authUser = action.payload;
    },
  },
});

export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;
