import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  results: [{name: 'Summit1'}, {name: 'Summit2'}]
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    updateSearchResults: (state, action) => {
      return {
        ...state,
        results: action.payload.results
      }
    }
  }
})

export const selectSearchResults = state => state[searchSlice.name].results

export const { updateSearchResults } = searchSlice.actions

export default searchSlice.reducer
