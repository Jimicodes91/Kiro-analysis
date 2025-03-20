import { configureStore } from '@reduxjs/toolkit';
import onboardingReducer from './slices/onboardingSlice';

export const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
    // Add other reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;