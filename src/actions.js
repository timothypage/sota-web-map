export function updateHomeLocation(location) {
      localStorage.setItem('homeLocation', JSON.stringify(location))

    return {
      type: 'UPDATE_HOME_LOCATION',
      payload: {
        location
      }
    }
}


