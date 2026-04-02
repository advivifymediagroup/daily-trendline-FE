"use client";

import { Box, Typography, Button } from "@mui/material";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <Typography variant="h4" className="font-bold mb-4">
        Something went wrong 😕
      </Typography>

      <Typography className="mb-6 text-gray-600">
        We encountered an unexpected error. Please try again.
      </Typography>

      <Button
        variant="contained"
        onClick={() => reset()}
        className="bg-black! text-white!"
      >
        Try Again
      </Button>
    </Box>
  );
}
