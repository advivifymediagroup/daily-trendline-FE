"use client";

import { Box, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useRouter } from "next/navigation";

type SearchBarProps = {
  width?: string;
  placeholder?: string;
  initialQuery?: string;
  clearOnSearch?: boolean;
  variant?: "light" | "dark";
  onSearch?: (query: string) => void;
};

const SearchBar = ({
  width = "w-full",
  placeholder = "Search news...",
  initialQuery = "",
  clearOnSearch = true,
  variant = "light",
  onSearch,
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;

    if (onSearch) {
      onSearch(query);
    }

    router.push(`/search?q=${encodeURIComponent(query)}`);

    if (clearOnSearch) setQuery("");
  };

  const isDark = variant === "dark";

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className={`flex items-center rounded-md px-2 py-1 border transition-all duration-200
        ${width}
        ${
          isDark
            ? "bg-gray-800 border-gray-700 text-white!"
            : "bg-white border-gray-300 text-black dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
        }`}
    >
      <InputBase
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`text-sm px-2 flex-1 ${
          isDark ? "text-white" : "text-black dark:text-slate-100"
        }`}
        sx={{
          color: '#fff',
          input: {
            color: "inherit",
          },
          "& input::placeholder": {
            color: isDark ? "#d1d5db" : "#64748b",
            opacity: 1,
          },
        }}
      />

      <IconButton
        type="submit"
        size="small"
        className={`${
          isDark
            ? "text-gray-300 hover:text-white"
            : "text-gray-600 hover:text-black dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        <SearchIcon sx={{
          color: "#fff"
        }} fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
