"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { SunMoon, Moon, LaptopMinimal } from "lucide-react";

export default function ThemeChanger() {
  const { theme, setTheme } = useTheme();
  const [dropDownOpen, setDropdownOpen] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const getIconForTheme = (themeName?: string) => {
    switch (themeName) {
      case "light":
        return <SunMoon fill="black" color="black" stroke="black" />;
      case "dark":
        return <Moon fill="white" />;
      case "system":
        return <LaptopMinimal />;
      default:
        return <SunMoon />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropDownOpen)}
        className="dark:fill-white"
      >
        {getIconForTheme(theme)}
      </button>

      {dropDownOpen && (
        <div
          className={`absolute right-0 top-10 w-fit origin-top-right rounded-xl bg-white md:right-0 md:top-12 md:mt-4 dark:bg-dark`}
        >
          <button
            onClick={() => {
              setTheme("light");
              setDropdownOpen(false);
            }}
            className={`${
              theme === "light" && "bg-gray-100 dark:bg-light-dark"
            } flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-black hover:bg-gray-200 dark:text-white dark:hover:bg-light-dark`}
          >
            <span>
              <SunMoon />
            </span>
            <span>Light</span>
          </button>

          <button
            onClick={() => {
              setTheme("dark");
              setDropdownOpen(false);
            }}
            className={`${
              theme === "dark" && "bg-gray-100 dark:bg-light-dark"
            } flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-black hover:bg-gray-200 dark:text-white dark:hover:bg-light-dark`}
          >
            <span>
              <Moon fill="white" />
            </span>
            <span>Dark</span>
          </button>

          <button
            onClick={() => {
              setTheme("system");
              setDropdownOpen(false);
            }}
            className={`${
              theme === "system" && "bg-gray-100 dark:bg-light-dark"
            } flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-black hover:bg-gray-200 dark:text-white dark:hover:bg-light-dark`}
          >
            <span>
              <LaptopMinimal />
            </span>
            <span>System</span>
          </button>
        </div>
      )}
    </div>
  );
}
