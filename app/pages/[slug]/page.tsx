import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Box, Typography } from "@mui/material";
import RenderBlocks from "@/components/RenderBlocks";
import { getPageData } from "@/app/api/news";
import ReactMarkdown from "react-markdown";

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

  const { title, description, content, blocks } = page;

  const hasBlocks = Array.isArray(blocks) && blocks.length > 0;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <Box className="bg-white border border-gray-200 p-6 md:p-10 dark:bg-slate-900 dark:border-slate-800">
        <Typography variant="h3" className="font-bold text-[#111111] mb-4 dark:text-slate-100">
          {title}
        </Typography>

        {/* {description && (
          <Typography className="text-[#444444] leading-8 whitespace-pre-line text-lg">
            {description}
          </Typography>
        )} */}

        {content && (
          <Box className="prose prose-lg max-w-none text-[#444444] prose-p:mb-4 prose-headings:mt-6 prose-headings:mb-3 dark:prose-invert dark:text-slate-300">
            <ReactMarkdown>{content}</ReactMarkdown>
          </Box>
        )}

        {hasBlocks && <RenderBlocks blocks={blocks} />}

        {!hasBlocks && !description && (
          <Typography className="text-gray-500 dark:text-slate-400">
            No content available for this page yet.
          </Typography>
        )}
      </Box>
    </main>
  );
}
