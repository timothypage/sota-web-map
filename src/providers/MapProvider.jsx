import { createContext, useContext } from 'react'

const MapContext = createContext(null)

export const useMap = () => {
  const map = useContext(MapContext)
  return map
}

function MapProvider({map, children}) {
  return <MapContext.Provider value={map}>{children}</MapContext.Provider>
}

export default MapProvider
