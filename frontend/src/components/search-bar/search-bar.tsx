"use client";

import classNames from "classnames";

import classes from "./search-bar.module.css";

interface SearchBarProps {
  setSearchString: (value: string) => void;
  searchString: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  setSearchString,
  searchString,
}) => {
  return (
    <section
      className={classNames(
        classes.inputWrapper,
        "hidden md:block my-auto mx-auto bg-gray-100 rounded-2xl border-zinc-700 dark:bg-gray-200 dark:border-gray-100 border-solid shadow-md "
      )}
    >
      <input
        type="text"
        className={classNames(
          "shadow-xl p-[0.5rem] text-black dark:text-[#DADADA] dark:bg-gray-800 rounded-xl ",
          classes.searchInput
        )}
        value={searchString}
        onChange={({ target: { value } }) => setSearchString(value)}
        placeholder="Search for module"
      />

    </section>
  );
};

export default SearchBar;
