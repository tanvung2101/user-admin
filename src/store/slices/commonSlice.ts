import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type dropdown = boolean
type theme = string

const commonSlice = createSlice({
    name: 'common',
    initialState: {
        theme: 'light',
        dropdown: true,
    },
    reducers: {
        changeTheme(state, action: PayloadAction<theme>){
            state.theme = action.payload
        },
        changeDropdown(state, action: PayloadAction<dropdown>){
            state.dropdown = action.payload
        },
    }
})

export const {changeTheme, changeDropdown} = commonSlice.actions;

export default commonSlice.reducer