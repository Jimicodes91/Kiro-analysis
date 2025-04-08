import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthData } from '../../../types';


type TAuthState = {
    authUser: AuthData | null
  }
  
  const initialState: TAuthState = {
    authUser: null,
  }

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<AuthData>) => {
        state.authUser = action.payload
      },
  },
});

export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;
