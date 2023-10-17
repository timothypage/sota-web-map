import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";
import { secondsToTime } from "/src/helpers/time.js";

import { useDirections } from "/src/providers/DirectionsProvider.jsx";

import { BsFillCarFrontFill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";

import { selectRoute, clearRoute } from "/src/reducers/navigationReducer.js";

import styles from "./RouteSummary.module.css";

const RouteSummary = ({ className }) => {
  const dispatch = useDispatch();
  const directions = useDirections();
  const route = useSelector(selectRoute);
  if (route == null) return null;

  return (
    <div className={classnames(className, styles.routeSummary)}>
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

export default RouteSummary;
