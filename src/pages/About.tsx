import { Helmet } from "react-helmet-async"
import { ABOUT_DATA } from "../data/constants"

export default function About() {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-4rem)]">
      <Helmet>
        <title>About Us | HMNS - Home of Humans</title>
        <meta name="description" content={ABOUT_DATA.content.substring(0, 150)} />
      </Helmet>

      <section className="w-full py-24 md:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                {ABOUT_DATA.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {ABOUT_DATA.content}
              </p>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted/50">
              <img
                src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800"
                alt="HMNS Perfume Crafting"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
