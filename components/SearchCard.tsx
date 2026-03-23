"use client";

import React, { useState } from "react";
import { Box, Typography, Chip, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import EmailIcon from "@mui/icons-material/Email";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useRouter } from "next/navigation";

interface SearchCardProps {
  imgUrl: string;
  headline: string;
  category: string;
  description?: string;
  date: string;
  chipColor?: string;
}

const SearchCard: React.FC<SearchCardProps> = ({
  imgUrl,
  headline,
  category,
  description,
  date,
  chipColor,
}) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  // slug for routing
  const slug = headline
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-");

  const handleNavigate = () => {
    router.push(`/${category.toLowerCase()}/${slug}`);
  };

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    handleClose();
  };

  console.log("ADSFDS::", chipColor);

  return (
    <Box
      onClick={handleNavigate}
      className="flex gap-4 p-4 rounded border border-gray-200 hover:shadow-md transition cursor-pointer bg-white"
    >
      {/* LEFT IMAGE */}
      <Box className="relative min-w-[180px] h-[150px]">
        <Image
          src={imgUrl}
          alt={headline}
          fill
          className="object-cover rounded-lg"
        />

        {/* CATEGORY CHIP */}
        <Chip
          label={category}
          size="small"
          sx={{
            bgcolor: chipColor,
          }}
          className="absolute! top-2 left-2 text-white! text-xs"
        />
      </Box>

      {/* RIGHT CONTENT */}
      <Box className="flex flex-col flex-1 justify-between">
        {/* TEXT */}
        <Box>
          <Typography className="font-semibold text-gray-900 line-clamp-2 hover:underline">
            {headline}
          </Typography>

          <Typography className="font-semibold text-gray-900 line-clamp-2 hover:underline text-sm! my-2!">
            {date}
          </Typography>

          <Typography className="text-sm text-gray-600 mt-1 line-clamp-2">
            {description}
          </Typography>
        </Box>

        {/* SHARE */}
        <Box className="flex justify-end mt-2">
          <Box onClick={handleShareClick} className="flex items-center gap-2">
            <ShareIcon fontSize="small" /> <Typography>Share</Typography>
          </Box>

          {/* SHARE MENU */}
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={handleClose}>
              <FacebookIcon fontSize="small" className="mr-2 text-blue-600!" />
              Facebook
            </MenuItem>

            <MenuItem onClick={handleClose}>
              <XIcon fontSize="small" className="mr-2 text-black" />X
            </MenuItem>

            <MenuItem onClick={handleClose}>
              <EmailIcon fontSize="small" className="mr-2 text-red-500" />
              Email
            </MenuItem>

            <MenuItem onClick={handleCopy}>
              <ContentCopyIcon
                fontSize="small"
                className="mr-2 text-green-600"
              />
              Copy Link
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchCard;
