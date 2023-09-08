import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  results: [],
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    updateSearchResults: (state, action) => {
      return {
        ...state,
        results: action.payload.results,
      };
    },
    clearSearchResults: (state, action) => {
      return {
        ...state,
        results: [],
      };
    },
  },
});

export const selectSearchResults = (state) => state[searchSlice.name].results;
export const selectTopSearchResults = (state) =>
  state[searchSlice.name].results;

export const { updateSearchResults, clearSearchResults } = searchSlice.actions;

export default searchSlice.reducer;
