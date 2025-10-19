import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   reel: []
}

export const reelSlice = createSlice({
  name: 'reel',
  initialState,
  reducers: {
    setReel: (state, action)=>{
        state.reel = action.payload
    }
  },
})

export const { setReel } = reelSlice.actions

export default reelSlice.reducer