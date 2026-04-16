import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Box, Typography } from "@mui/material";
import RenderBlocks from "@/components/RenderBlocks";
import { getPageData } from "@/app/api/news";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageData(slug);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: page.title || "Page",
    description: page.description || "",
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = await getPageData(slug);

  if (!page) {
    return notFound();
  }

  const { title, description, blocks } = page;

  const hasBlocks = Array.isArray(blocks) && blocks.length > 0;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Box className="bg-white border border-gray-200 p-6 md:p-10">
        <Typography variant="h3" className="font-bold text-[#111111] mb-4">
          {title}
        </Typography>

        {description && (
          <Typography className="text-[#444444] leading-8 whitespace-pre-line text-lg">
            {description}
          </Typography>
        )}

        {hasBlocks && <RenderBlocks blocks={blocks} />}

        {!hasBlocks && !description && (
          <Typography className="text-gray-500">
            No content available for this page yet.
          </Typography>
        )}
      </Box>
    </main>
  );
}
