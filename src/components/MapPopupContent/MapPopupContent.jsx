import { useSelector, useDispatch } from "react-redux";
import { useDirections } from "/src/providers/DirectionsProvider.jsx";
import {
  updateHomeLocation,
  selectHomeLocation,
} from "/src/reducers/navigationReducer.js";

import { AiFillHome } from "react-icons/ai";
import LayerInfo from "/src/components/LayerInfo";

import styles from "./MapPopupContent.module.css";

const MapPopupContent = ({ features, popupEvent, popup }) => {
  const home = useSelector(selectHomeLocation);
  const dispatch = useDispatch();
  const directions = useDirections();

  return (
    <div className={styles.mapPopupContent}>
      <LayerInfo features={features} />
      <div className={styles.navButtons}>
        <button
          className={styles.navButton}
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
          className={styles.navButton}
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
    </div>
  );
};

export default MapPopupContent;
