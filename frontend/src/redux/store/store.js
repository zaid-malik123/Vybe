import { configureStore } from '@reduxjs/toolkit'
import userSlice from '../slice/userSlice'
import postSlice  from '../slice/postSlice'
import reelSlice  from '../slice/reelSlice'
import storySlice  from '../slice/storySlice'
export const store = configureStore({
  reducer: {
    userSlice: userSlice,
    postSlice: postSlice,
    reelSlice: reelSlice,
    storySlice: storySlice
  },
})