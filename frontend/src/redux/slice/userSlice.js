import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  suggestedUser: null,
  profileData: null,
  following: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUser: (state, action) => {
      state.suggestedUser = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setFollowing: (state, action) => {
      state.following = action.payload;
    },
    toogleFollow: (state, action) => {
      const userId = action.payload;
      if (state.following.includes(userId)) {
        state.following = state.following.filter((f) => f !== userId);
      } else {
        state.following.push(userId);
      }
    },
  },
});

export const {
  setUser,
  setSuggestedUser,
  setProfileData,
  setFollowing,
  toogleFollow,
} = userSlice.actions;

export default userSlice.reducer;
