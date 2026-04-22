type Props = {
  data: {
    content: string
  }
}

export default function RichText({ data }: Props) {
  return (
    <div
      className="prose mx-auto py-10"
      dangerouslySetInnerHTML={{ __html: data.content }}
    />
  )
}