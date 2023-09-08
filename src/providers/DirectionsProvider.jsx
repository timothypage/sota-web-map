import { createContext, useContext } from "react";

const DirectionsContext = createContext(null);

export const useDirections = () => {
  const directions = useContext(DirectionsContext);
  return directions;
};

function DirectionsProvider({ directions, children }) {
  return (
    <DirectionsContext.Provider value={directions}>
      {children}
    </DirectionsContext.Provider>
  );
}

export default DirectionsProvider;
