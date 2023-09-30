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
    selectNextSearchResult: (state, action) => {
      const selectedIndex = state.results.findIndex((r) => r._selected == true);

      let nextResults = state.results;

      if (selectedIndex >= 0) {
        nextResults = state.results.map((item, index) => {
          return {
            ...item,
            _selected:
              selectedIndex + (action?.payload ?? 1) === index ? true : false,
          };
        });
      } else {
        // nothing was selected, select the first item
        nextResults = state.results.map((item, index) => {
          return {
            ...item,
            _selected: index === 0 ? true : false,
          };
        });
      }

      return {
        ...state,
        results: nextResults,
      };
    },
  },
});

export const selectSearchResults = (state) => state[searchSlice.name].results;
export const selectTopSearchResults = (state) =>
  state[searchSlice.name].results;

export const selectSelectedResult = (state) =>
  state[searchSlice.name].results.find((r) => r.item._selected)?.item;

export const {
  updateSearchResults,
  clearSearchResults,
  selectNextSearchResult,
} = searchSlice.actions;

export default searchSlice.reducer;
