"use client";

import Logo from "./logo";
import UserMenu from "./userMenu";
import React, { ReactNode } from "react";
import { getCurrentUser } from "@/services/user";
import SearchBar from "../search-bar/search-bar";
import { usePredictionContext } from "@/context/prediction";
import ThemeChanger from "../ThemeChanger";

type NavigationBarProps = {
  children: ReactNode;
};

const NavigationBar = () => {
  const { searchString, setSearchString } = usePredictionContext();

  return (
    <header className="top-0 left-0 w-full bg-white dark:bg-[#131B2A] fixed z-10 animate-menu-fade shadow-xl">
      <nav className="py-4 border-b-[0px] px-10">
        <div className="flex justify-between items-center">
          <Logo />
          <SearchBar
            searchString={searchString}
            setSearchString={setSearchString}
          />
          <UserMenu />
          <ThemeChanger />
        </div>
      </nav>
    </header>
  );
};

export default NavigationBar;
