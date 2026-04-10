import { notFound } from "next/navigation";
import RenderBlocks from "@/components/RenderBlocks";
import { getPageData } from "@/app/api/news";

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const page = await getPageData(params.slug);

  if (!page) {
    return notFound();
  }

  const { title, blocks } = page;

  return (
    <main>
      {/* Optional title */}
      <h1 className="text-3xl font-bold text-center">{title}</h1>

      <RenderBlocks blocks={blocks} />
    </main>
  );
}
