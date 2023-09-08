import { useSelector, useDispatch } from "react-redux";
import { useDirections } from "/src/providers/DirectionsProvider.jsx";

import { BsFillCarFrontFill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";

import { selectRoute, clearRoute } from "/src/reducers/navigationReducer.js";

import styles from "./RouteSummary.module.css";

const RouteSummary = () => {
  const dispatch = useDispatch();
  const directions = useDirections();
  const route = useSelector(selectRoute);
  if (route == null) return null;

  return (
    <div className={styles.routeSummary}>
      <div className={styles.routeLength}>
        <BsFillCarFrontFill />
        <p>{secondsToTime(route.duration)}</p>
        <p>{metersToMiles(route.distance)} mi</p>
      </div>
      <div className={styles.close}>
        <button
          className={styles.closeButton}
          onClick={() => {
            dispatch(clearRoute());
            directions.clear(); // remove from map;
          }}
        >
          <AiOutlineClose />
        </button>
      </div>
    </div>
  );
};

const metersToMiles = (meters) => {
  let miles = meters * 0.0006213712;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(miles);
};

// "| 0" force integer math so we don't get floats
const secondsToTime = (seconds) => {
  const roundSeconds = Math.ceil(seconds);
  const minutes = (roundSeconds / 60) | 0;
  const hours = (minutes / 60) | 0;
  const remainderMinutes = minutes % 60 | 0;

  let summary = "";
  if (hours > 0) summary += `${hours}h `;

  if (remainderMinutes > 0) summary += `${remainderMinutes}m`;

  return summary;
};

export default RouteSummary;
