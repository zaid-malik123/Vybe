import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   story: [],
   storyList: null
}

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setStory: (state, action)=>{
        state.story = action.payload
    },
    setStoryList: (state, action)=>{
        state.storyList = action.payload
    }
  },
})

export const { setStory, setStoryList } = storySlice.actions

export default storySlice.reducer