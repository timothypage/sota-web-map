import Fuse from "fuse.js";
import { useRef, useState } from "react";
import classnames from "classnames";
import { useMap } from "/src/providers/MapProvider.jsx";

import { FaMountain, FaCity } from "react-icons/fa";
import { BiSolidBuildingHouse } from "react-icons/bi";
import { GiHouse } from "react-icons/gi";

import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

import styles from "./SearchBox.module.css";

// TODO move geocoding to backend service...go with the client solution for now
let fuse = new Fuse([], {
  keys: ["name", "code"],
  threshold: 0.4,
});

fetch("/tiles/geocode-0d3ca704.json")
  .then((response) => response.json())
  .then((data) => fuse.setCollection(data));

const SearchBox = () => {
  const map = useMap();
  const searchRef = useRef();
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);

  return (
    <div className={styles.wrapper}>
      <form
        className={styles.searchBox}
        onSubmit={(e) => {
          e.preventDefault(); // don't submit the form to the site, handle in React :)

          console.log(`searching ${searchRef.current.value}`);

          setSearched(true);
          setResults(fuse.search(searchRef.current.value).slice(0, 20));
        }}
      >
        <input
          className={styles.searchInput}
          type="text"
          ref={searchRef}
          onChange={(e) => e.target.value === "" && setSearched(false)}
        />
        {searched ? (
          <button
            className={styles.searchButton}
            onClick={(e) => {
              e.preventDefault(); // don't submit the form

              searchRef.current.value = "";
              setSearched(false);
              setResults([]);
            }}
          >
            <AiOutlineClose />
          </button>
        ) : (
          <button type="submit" className={styles.searchButton}>
            <AiOutlineSearch />
          </button>
        )}
      </form>
      {results.length > 0 && (
        <div className={styles.searchResultsWrapper}>
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
                  className={classnames(styles.result, {
                    [styles.selected]: result._selected,
                  })}
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
        </div>
      )}
    </div>
  );
};

export default SearchBox;
