import maplibregl from "maplibre-gl";
import { useCallback } from "react";
import { loadGPX, measureGPX } from "/src/helpers/load-gpx.js";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";
import { useAuth } from "react-oidc-context";
import { useMap } from "/src/providers/MapProvider.jsx";
import { useDispatch } from "react-redux";
import { updateGpxElevationData } from "/src/reducers/gpxStore.js";

import styles from "./GpxSummary.module.css";

const GpxSummary = ({ file }) => {
  const auth = useAuth();
  const map = useMap();
  const dispatch = useDispatch();

  const load = useCallback(async () => {
    const { url } = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/user-files/${file.id}/fetch`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
      }
    ).then((r) => r.json());

    const gpx = await loadGPX(url, map, maplibregl);
    const { elevation_chart_data } = measureGPX(gpx);
    dispatch(updateGpxElevationData({ elevation_chart_data }));
  }, [auth, map]);

  return (
    <div className={styles.gpxSummary} onClick={load}>
      <div>{file.filename}</div>
      <div className={styles.fileDetails}>
        <div>{(file.gpx_info?.distance_ft / 5280).toFixed(1)} mi</div>
        <div>
          <BsCaretUpFill className={styles.up} />{" "}
          {file.gpx_info?.gained_elevation_ft} ft
        </div>
        <div>
          <BsCaretDownFill className={styles.down} />{" "}
          {file.gpx_info?.lost_elevation_ft} ft
        </div>
      </div>
    </div>
  );
};

export default GpxSummary;
