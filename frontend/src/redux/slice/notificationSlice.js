import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   notificationData: null
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationData: (state, action)=>{
      state.notificationData = action.payload
    }
  },
})

export const { setNotificationData } = notificationSlice.actions

export default notificationSlice.reducer