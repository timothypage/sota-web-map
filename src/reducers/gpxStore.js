import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  elevation_chart_data: null
}

export const gpxSlice = createSlice({
  name: "gpx",
  initialState,
  reducers: {
    updateGpxElevationData: (state, action) => {
      return {
        ...state,
        elevation_chart_data: action.payload.elevation_chart_data
      }
    }
  }
})

export const selectGpxElevationChartData = (state) => state[gpxSlice.name].elevation_chart_data;

export const {
  updateGpxElevationData
} = gpxSlice.actions;

export default gpxSlice.reducer;