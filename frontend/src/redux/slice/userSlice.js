import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  suggestedUser: null,
  profileData: null
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
    },
    setProfileData: (state, action)=>{
      state.profileData = action.payload
    }
  },
})

export const { setUser , setSuggestedUser, setProfileData} = userSlice.actions

export default userSlice.reducer