import Hero from "./blocks/Hero";
import ContactForm from "./blocks/ContactForm";
import RichText from "./blocks/RichText";

const componentMap: Record<string, any> = {
  "blocks.hero": Hero,
  "blocks.contact-form": ContactForm,
  "blocks.rich-text": RichText,
};

type Props = {
  blocks: any[];
};

export default function RenderBlocks({ blocks }: Props) {
  if (!blocks) return null;

  return (
    <>
      {blocks.map((block, index) => {
        const Component = componentMap[block.__component];

        if (!Component) return null;

        return <Component key={index} data={block} />;
      })}
    </>
  );
}
