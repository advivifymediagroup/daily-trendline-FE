"use client";

import Link from "next/link";
import { Button } from "@mui/material";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center max-w-312.5!">
      {/* 404 Code with gradient glow */}
      <h1 className="text-7xl md:text-9xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg animate-pulse">
        404
      </h1>

      <h2 className="text-3xl md:text-4xl font-semibold mb-2 text-gray-200">
        Oops! Page not found
      </h2>

      <p className="text-gray-400 mb-8 max-w-md md:text-lg">
        The page you are looking for doesn’t exist or has been moved. But don’t
        worry, you can go back home or explore other pages.
      </p>

      {/* Home Button */}
      <Link href="/">
        <Button
          variant="contained"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 shadow-lg px-6 py-2 text-lg font-medium transition-all duration-300"
        >
          Go to Home
        </Button>
      </Link>
    </div>
  );
}
