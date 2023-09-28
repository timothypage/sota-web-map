import Fuse from "fuse.js";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateSearchResults,
  clearSearchResults,
} from "/src/reducers/searchReducer.js";

import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

import styles from "./SearchBox.module.css";

// TODO move geocoding to backend service...go with the hacky solution for now
let fuse = new Fuse([], {
  keys: ["name", "code"],
  threshold: 0.4,
});

fetch("/tiles/geocode-0d3ca704.json")
  .then((response) => response.json())
  .then((data) => fuse.setCollection(data));

const SearchBox = () => {
  const dispatch = useDispatch();
  const searchRef = useRef();
  const [searched, setSearched] = useState(false);

  return (
    <form
      className={styles.searchBox}
      onSubmit={(e) => {
        e.preventDefault(); // don't submit the form to the site, handle in React :)

        const results = fuse.search(searchRef.current.value).slice(0, 6);

        console.log("results", results);

        setSearched(true);
        dispatch(updateSearchResults({ results }));
      }}
    >
      <input className={styles.searchInput} type="text" ref={searchRef} />
      {searched ? (
        <button
          className={styles.searchButton}
          onClick={(e) => {
            e.preventDefault(); // don't submit the form

            searchRef.current.value = "";
            setSearched(false);
            dispatch(clearSearchResults());
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
  );
};

export default SearchBox;
