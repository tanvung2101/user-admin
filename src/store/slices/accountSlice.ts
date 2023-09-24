import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthUserResponse } from 'src/interface'
import { storage } from '../../utils/storage'
import { STORAGE_KEY } from '../../constants/storage-key'

interface account {
  token: string | null
  info: AuthUserResponse[] | any
}


const initialState: account = {
  token:storage.get(STORAGE_KEY.TOKEN) || '',
  info: storage.get(STORAGE_KEY.INFO) || null,
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setInfoAndTokenAccount(state, action: PayloadAction<account>) {
      const { token, info } = action.payload
      state.token = token
      state.info = info
    },
    setInfoAccount(state, action: PayloadAction<account>) {
      state.info = action.payload.info
    },
    logout(state) {
      state.token = ''
      state.info = null
    },
    setToken(state, action: PayloadAction<{token: string}>) {
        console.log(state.token)
      state.token = action.payload.token
    },
    setProfileAuth(state, action: PayloadAction<account>) {
      state.info = action.payload.info
    }
  }
})

export const { setInfoAndTokenAccount, setInfoAccount, logout, setToken, setProfileAuth } = accountSlice.actions

export default accountSlice.reducer
