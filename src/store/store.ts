import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import challengesReducer from './slices/challengesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        challenges: challengesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 