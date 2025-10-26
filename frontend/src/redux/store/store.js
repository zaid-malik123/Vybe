import { configureStore } from '@reduxjs/toolkit'
import userSlice from '../slice/userSlice'
import postSlice  from '../slice/postSlice'
import reelSlice  from '../slice/reelSlice'
import storySlice  from '../slice/storySlice'
import messageSlice  from '../slice/messageSlice'
import socketSlice  from '../slice/socketSlice'
import notificationSlice  from '../slice/notificationSlice'
export const store = configureStore({
  reducer: {
    userSlice: userSlice,
    postSlice: postSlice,
    reelSlice: reelSlice,
    storySlice: storySlice,
    messageSlice: messageSlice,
    socketSlice: socketSlice,
    notificationSlice: notificationSlice
  },
})