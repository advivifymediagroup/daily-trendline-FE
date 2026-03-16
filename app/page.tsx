import NewsCard from "@/components/NewsCard";
import { Box, Typography } from "@mui/material";
import {
  breakingNews,
  featuredNews,
  gridNews,
  secondaryNews,
} from "../components/dummyData";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";

export default function Home() {
  return (
    <Box className="homepage max-w-7xl mx-auto px-4 py-6 flex flex-col gap-10">
      <BreakingNewsTicker news={breakingNews} />
      {/* Featured Section */}
      <Box className="flex flex-col gap-4">
        <Typography variant="h4" className="font-bold">
          Featured News
        </Typography>

        <NewsCard {...featuredNews} />
      </Box>

      {/* Top Stories */}
      <Box className="flex flex-col gap-4">
        <Typography variant="h5" className="font-semibold">
          Top Stories
        </Typography>

        <Box className="grid md:grid-cols-2 gap-6">
          {secondaryNews.map((news, index) => (
            <NewsCard key={index} {...news} />
          ))}
        </Box>
      </Box>

      {/* Latest News */}
      <Box className="flex flex-col gap-4">
        <Typography variant="h5" className="font-semibold">
          Latest News
        </Typography>

        <Box className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gridNews.map((news, index) => (
            <NewsCard key={index} {...news} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
