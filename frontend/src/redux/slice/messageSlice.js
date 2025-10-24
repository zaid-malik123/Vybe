import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   selectedUser: null
}

export const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setSelectedUser: (state, action)=>{
        state.selectedUser = action.payload
    }
  },
})

export const { setSelectedUser } = messageSlice.actions

export default messageSlice.reducer