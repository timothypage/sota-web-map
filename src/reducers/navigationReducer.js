import { createSlice } from "@reduxjs/toolkit";

let home = [-104.99168, 39.73882]; // Denver City Hall, default value

try {
  home = JSON.parse(localStorage.getItem("homeLocation"));
} catch (e) {
  console.log(e);
  console.log("invalid home location stored in localStorage");
}

const initialState = {
  home,
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    updateHomeLocation: (state, action) => {
      localStorage.setItem(
        "homeLocation",
        JSON.stringify(action.payload.location)
      );

      return {
        ...state,
        home: action.payload.location,
      };
    },
  },
});

export const selectHomeLocation = (state) => state[navigationSlice.name].home;

export const { updateHomeLocation } = navigationSlice.actions;

export default navigationSlice.reducer;
