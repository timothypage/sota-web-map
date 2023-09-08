import { useSelector, useDispatch } from "react-redux";
import { useMap } from "/src/providers/MapProvider.jsx";
import { useDirections } from "/src/providers/DirectionsProvider.jsx";
import {
  updateHomeLocation,
  selectHomeLocation,
} from "/src/reducers/navigationReducer.js";

import { AiFillHome } from "react-icons/ai";

import styles from "./MapPopupContent.module.css";

const MapPopupContent = ({ features, popupEvent, popup }) => {
  const home = useSelector(selectHomeLocation);
  const dispatch = useDispatch();
  const directions = useDirections();

  return (
    <>
      <div>MapPopupContent</div>
      <div className={styles.navButtons}>
        <button
          onClick={() => {
            directions.setWaypoints([
              home,
              [popupEvent.lngLat.lng, popupEvent.lngLat.lat],
            ]);

            popup.remove();
          }}
        >
          Navigate Here
        </button>
        <button
          onClick={() => {
            dispatch(
              updateHomeLocation({
                location: [popupEvent.lngLat.lng, popupEvent.lngLat.lat],
              })
            );

            popup.remove();
          }}
        >
          <AiFillHome />
        </button>
      </div>
    </>
  );
};

export default MapPopupContent;
