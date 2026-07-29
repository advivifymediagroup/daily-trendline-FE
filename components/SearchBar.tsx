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
      className={`flex items-center px-2 py-1 border-2 transition-colors duration-200
        ${width}
        ${
          isDark
            ? "bg-slate-900 border-slate-700 text-white"
            : "bg-white border-slate-900 text-slate-900 dark:bg-slate-950 dark:border-slate-100 dark:text-slate-100"
        }`}
    >
      <InputBase
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="text-sm px-2 flex-1 text-inherit"
        sx={{
          color: "inherit",
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
        aria-label="Search"
        className="text-inherit!"
      >
        <SearchIcon fontSize="small" className="text-inherit" />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
