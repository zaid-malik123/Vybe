import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   story: []
}

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setStory: (state, action)=>{
        state.post = action.payload
    }
  },
})

export const { setStory } = storySlice.actions

export default storySlice.reducer