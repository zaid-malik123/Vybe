import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   reels: []
}

export const reelSlice = createSlice({
  name: 'reels',
  initialState,
  reducers: {
    setReels: (state, action)=>{
        state.reels = action.payload
    }
  },
})

export const { setReels } = reelSlice.actions

export default reelSlice.reducer