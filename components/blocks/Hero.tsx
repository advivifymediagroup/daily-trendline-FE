type Props = {
  data: {
    title: string
    subtitle: string
  }
}

export default function Hero({ data }: Props) {
  return (
    <section className="py-16 text-center">
      <h1 className="text-4xl font-bold">{data.title}</h1>
      <p className="mt-4 text-lg">{data.subtitle}</p>
    </section>
  )
}