import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  suggestedUser: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action)=>{
        state.user = action.payload
    },
    setSuggestedUser: (state, action)=>{
      state.suggestedUser = action.payload
    }
  },
})

export const { setUser , setSuggestedUser} = userSlice.actions

export default userSlice.reducer