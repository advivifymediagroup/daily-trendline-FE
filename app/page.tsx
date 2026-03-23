import NewsCard from "@/components/NewsCard";
import { Box, Typography } from "@mui/material";
import {
  breakingNews,
  featuredNews,
  featuredRight,
  gridNews,
  latestCategoryNews,
  secondaryNews,
} from "../components/dummyData";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";
import CategoryNewsCard from "@/components/CategoryNewsCard";

export default function Home() {
  return (
    <Box className="homepage max-w-7xl mx-auto px-4 py-6 flex flex-col gap-10">
      <BreakingNewsTicker news={breakingNews} />
      {/* Featured Section */}
      <Box className="flex flex-col gap-4">
        <Typography variant="h4" className="font-bold">
          Featured News
        </Typography>

        <Box className="grid md:grid-cols-3 gap-3">
          {/* LEFT BIG CARD */}
          <Box className="md:col-span-2">
            <NewsCard {...featuredNews} height={492} />
          </Box>

          {/* RIGHT SIDE */}
          <Box className="flex flex-col gap-3">
            {featuredRight.map((item, index) => (
              <NewsCard key={index} {...item} height={240} />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Top Stories */}
      <Box className="flex flex-col gap-4">
        <Typography variant="h5" className="font-bold!">
          Top Stories
        </Typography>

        <Box className="grid md:grid-cols-2 gap-6">
          {secondaryNews.map((news, index) => (
            <NewsCard key={index} {...news} />
          ))}
        </Box>
      </Box>

      {/* Latest News */}
      {/* <Box className="flex flex-col gap-4">
        <Typography variant="h5" className="font-bold">
          Latest News
        </Typography>

        <Box className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gridNews.map((news, index) => (
            <NewsCard key={index} {...news} />
          ))}
        </Box>
      </Box> */}

      {/* LATEST SECTION */}
      <Box className="flex flex-col gap-6 mt-2">
        {/* <Typography variant="h5" className="font-bold">
          Latest News
        </Typography> */}

        <Box className="grid md:grid-cols-2 gap-6">
          {/* Business Section */}
          <Box className="bg-white rounded-sm flex flex-col gap-4 p-4">
            <Typography variant="h5" className="font-bold! text-lg pb-2">
              Latest in Business
            </Typography>

            <Box className="flex flex-col gap-3">
              {latestCategoryNews
                .filter((item) => item.category === "Business")
                .slice(0, 4)
                .map((item, index) => (
                  <CategoryNewsCard key={index} {...item} />
                ))}
            </Box>
          </Box>
          {/* Tech Section */}
          <Box className="bg-white rounded-sm flex flex-col gap-4 p-4">
            <Typography variant="h5" className="font-bold! pb-2">
              Latest in Technology
            </Typography>

            <Box className="flex flex-col gap-3">
              {latestCategoryNews
                .filter((item) => item.category === "Technology")
                .slice(0, 4)
                .map((item, index) => (
                  <CategoryNewsCard key={index} {...item} />
                ))}
            </Box>
          </Box>

          {/* Sports Section */}
          <Box className="bg-white rounded-sm flex flex-col gap-4 p-4">
            <Typography variant="h5" className="font-bold! text-lg pb-2">
              Latest in Sports
            </Typography>

            <Box className="flex flex-col gap-3">
              {latestCategoryNews
                .filter((item) => item.category === "Sports")
                .slice(0, 4)
                .map((item, index) => (
                  <CategoryNewsCard key={index} {...item} />
                ))}
            </Box>
          </Box>

          {/* Entertainment Section */}
          <Box className="bg-white rounded-sm flex flex-col gap-4 p-4">
            <Typography variant="h5" className="font-bold! text-lg pb-2">
              Latest in Entertainment
            </Typography>

            <Box className="flex flex-col gap-3">
              {latestCategoryNews
                .filter((item) => item.category === "Entertainment")
                .slice(0, 4)
                .map((item, index) => (
                  <CategoryNewsCard key={index} {...item} />
                ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
