import { Box } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-gray-200">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-4 gap-8"></Box>
      {/* Copyright */}
      <Box className="border-t border-gray-700 py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} MyApp. All rights reserved.
      </Box>
    </footer>
  );
};

export default Footer;
