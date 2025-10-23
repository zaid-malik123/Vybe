import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   story: [],
   storyList: null,
   currentUserStory: null
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
    },
    setCurrentUserStory: (state, action)=>{
        state.currentUserStory = action.payload
    },
  },
})

export const { setStory, setStoryList, setCurrentUserStory } = storySlice.actions

export default storySlice.reducer