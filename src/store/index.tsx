import { configureStore } from '@reduxjs/toolkit';
import accountSlice from './slices/accountSlice';
import commonSlice from './slices/commonSlice';

export const store = configureStore({
    reducer: {
        account: accountSlice,
        common: commonSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
