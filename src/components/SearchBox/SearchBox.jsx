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
  const searchInputRef = useRef();
  const searchResultsRef = useRef();
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  function resetSearch() {
    setSearched(false);
    setSelectedIndex(-1);
  }

  function scrollTo(el, top) {
    el.scrollTop = top;
  }

  function focusOption(offset) {
    setSelectedIndex((state) => {
      if (state + offset > results.length - 1) return state;
      if (state + offset < -1) return -1;

      return state + offset;
    });

    const selectedOption = searchResultsRef.current.querySelector(
      `.${styles.selected}`
    );

    if (selectedOption == null) return;

    const searchResultsRect = searchResultsRef.current.getBoundingClientRect();
    const selectedOptionRect = selectedOption.getBoundingClientRect();

    const overScroll = selectedOption.offsetHeight / 3 + 40;

    if (selectedOptionRect.bottom + overScroll > searchResultsRect.bottom) {
      scrollTo(
        searchResultsRef.current,
        Math.min(
          selectedOption.offsetTop +
            selectedOption.clientHeight -
            searchResultsRef.current.offsetHeight +
            overScroll,
          searchResultsRef.current.scrollHeight
        )
      );
    } else if (selectedOptionRect.top - overScroll < searchResultsRect.top) {
      scrollTo(
        searchResultsRef.current,
        Math.max(selectedOption.offsetTop - overScroll, 0)
      );
    }
  }

  function navigateMap(r) {
    if (r.point_geometry) map.jumpTo({ center: r.point_geometry, zoom: 13 });
    if (r.bounds) map.fitBounds(r.bounds, { animate: false });
  }

  return (
    <div className={styles.wrapper}>
      <form
        className={styles.searchBox}
        onSubmit={(e) => {
          e.preventDefault(); // don't submit the form to the site, handle in React :)

          setSearched(true);
          setSelectedIndex(-1);
          setResults(fuse.search(searchInputRef.current.value).slice(0, 20));
        }}
      >
        <input
          className={styles.searchInput}
          type="text"
          ref={searchInputRef}
          onChange={(e) => {
            if (e.target.value === "") {
              setSearched(false);
            }
          }}
          onKeyDown={(e) => {
            if (!searched) return;
            if (e.code === "ArrowUp") focusOption(-1);
            if (e.code === "ArrowDown") focusOption(1);
            if (e.code === "Enter" && searched && selectedIndex > -1) {
              // don't submit the form or search
              e.preventDefault();
              e.stopPropagation();

              navigateMap(results[selectedIndex].item);
            }
          }}
        />
        {searched ? (
          <button
            className={styles.searchButton}
            onClick={(e) => {
              e.preventDefault(); // don't submit the form

              searchInputRef.current.value = "";
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
          <div className={styles.searchResults} ref={searchResultsRef}>
            {results.map((result, index) => {
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
                    [styles.selected]: index === selectedIndex,
                  })}
                  onClick={() => navigateMap(r)}
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
