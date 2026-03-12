import { CircularProgress, Box } from "@mui/material";

export default function Loading() {
  return (
    <Box className="min-h-screen flex items-center justify-center bg-black">
      <CircularProgress className="text-white!" />
    </Box>
  );
}
