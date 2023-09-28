import { useSelector } from "react-redux";
import { selectTopSearchResults } from "/src/reducers/searchReducer.js";
import { useMap } from "/src/providers/MapProvider.jsx";

import { FaMountain, FaCity } from "react-icons/fa";
import { BiSolidBuildingHouse } from "react-icons/bi";
import { GiHouse } from "react-icons/gi";

import styles from "./SearchResults.module.css";

const SearchResults = () => {
  const results = useSelector(selectTopSearchResults);
  const map = useMap();

  return (
    <div className={styles.searchResults}>
      {results.map((result) => {
        const r = result.item;
        let ResultIcon = null;

        if (r.type === "summit") ResultIcon = FaMountain;
        if (r.type === "city") ResultIcon = FaCity;
        if (r.type === "town") ResultIcon = BiSolidBuildingHouse;
        if (r.type === "village") ResultIcon = GiHouse;

        return (
          <div
            key={result.refIndex}
            className={styles.result}
            onClick={() => {
              if (r.point_geometry)
                map.jumpTo({ center: r.point_geometry, zoom: 13 });
              if (r.bounds) map.fitBounds(r.bounds, { animate: false });
            }}
          >
            <ResultIcon size={24} />
            <p>{r.name}</p>
            <p className={styles.code}>{r.code}</p>
          </div>
        );
      })}
    </div>
  );
};

export default SearchResults;
