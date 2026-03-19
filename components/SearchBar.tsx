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
  clearOnSearch = false,
  variant = "light",
  onSearch,
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;

    if (onSearch) {
      onSearch(query);
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }

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
      className={`flex items-center rounded-md px-2 py-1 border 
        ${width}
        ${
          isDark
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-300 text-black"
        }`}
    >
      <InputBase
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`text-sm px-2 flex-1 ${
          isDark ? "text-white" : "text-black"
        }`}
      />

      <IconButton
        type="submit"
        size="small"
        className={`${
          isDark
            ? "text-gray-300 hover:text-white"
            : "text-gray-600 hover:text-black"
        }`}
      >
        <SearchIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
