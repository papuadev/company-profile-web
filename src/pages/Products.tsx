import { Helmet } from "react-helmet-async"
import { STATIC_PRODUCTS } from "../data/constants"

export default function Products() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Helmet>
        <title>Products | HMNS - Home of Humans</title>
        <meta name="description" content="Explore the full collection of HMNS fragrances." />
      </Helmet>

      <section className="w-full py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-4 mb-16">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Our Collection</h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Explore our meticulously crafted fragrances designed to elevate your everyday presence.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {STATIC_PRODUCTS.map((product) => (
              <div key={product.id} className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-lg">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={product.image}
                    alt={`HMNS Product: ${product.name}`}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  </div>
                  <p className="mt-6 font-semibold">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
