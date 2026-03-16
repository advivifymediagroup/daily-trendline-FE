"use client";

import { Box, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;

    console.log("Search:", query);

    // router.push(`/search?q=${query}`)
  };

  return (
    <Box className="flex items-center bg-white rounded-md px-2 py-1 border border-gray-700">
      <InputBase
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="text-white text-sm px-2 w-36 lg:w-48"
      />

      <IconButton
        size="small"
        onClick={handleSearch}
        className="text-gray-600!"
      >
        <SearchIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
