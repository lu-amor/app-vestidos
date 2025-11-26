import Image from "next/image";
import Link from "next/link";
import { listItems, Item, Category } from "../../lib/RentalManagementSystem";
import SearchFilters from "../components/SearchFilters";

// Hacemos el componente async y tipamos searchParams como Promise de objeto
type HomeSearchParams = Promise<{
  q?: string;
  category?: string;
  size?: string;
  color?: string;
  style?: string;
  start?: string;
  end?: string;
  minPrice?: string;
  maxPrice?: string;
}>;

export default async function Home({ searchParams }: { searchParams: HomeSearchParams }) {
  // Esperamos los searchParams ANTES de usarlos
  const params = (await searchParams) || {};

  const {
    q = "",
    category = "",
    size = "",
    color = "",
    style = "",
    start = "",
    end = "",
    minPrice = "",
    maxPrice = "",
  } = params;

  const featured: Array<{
    id: number;
    name: string;
    price: number;
    image: string;
    alt: string;
  }> = listItems({
    q,
    category: category ? (category as Category) : undefined,
    size: size || undefined,
    color: color || undefined,
    style: style || undefined,
    start: start || undefined,
    end: end || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  })
    .filter((it: Item) => it.category === "dress")
    .slice(0, 4)
    .map((it: Item) => ({
      id: it.id,
      name: it.name,
      price: it.pricePerDay,
      image: it.images[0],
      alt: it.alt ?? it.name,
    }));

  const steps = [
    {
      emoji: "🔍",
      title: "Browse",
      text: "Find styles by size, color, designer, or occasion.",
    },
    {
      emoji: "📅",
      title: "Rent",
      text: "Pick dates and get it delivered to your door.",
    },
    {
      emoji: "📦",
      title: "Return",
      text: "Wear, wow, and send it back—cleaning included.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f3ee] to-[#bcb8b1] text-[#463f3a] dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-30 backdrop-blur bg-[#463f3a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-lg">
          <Link
            href="/"
            className="font-extrabold text-xl tracking-tight text-[#e0afa0]"
          >
            GlamRent
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#f4f3ee]">
            <Link href="/search" className="hover:text-[#e0afa0]">
              Browse
            </Link>
            <Link href="#how" className="hover:text-[#e0afa0]">
              How it works
            </Link>
            <Link href="#featured" className="hover:text-[#e0afa0]">
              Featured
            </Link>
            <Link href="/faq" className="hover:text-[#e0afa0]">
              FAQ
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#463f3a] dark:text-slate-100">
                Rent designer dresses for every
                <span className="mx-2 bg-gradient-to-r from-[#463f3a] to-[#e0afa0] bg-clip-text text-transparent">
                  occasion
                </span>
                .
              </h1>
              <p className="mt-6 text-base sm:text-lg text-[#463f3a] dark:text-slate-200">
                Look stunning without the price tag. Flexible rentals, free
                cleaning, and fast delivery.
              </p>

              {/* MISMOS filtros que en /search */}
              <form action="/search" method="GET" className="mt-8">
                <SearchFilters
                  defaults={{
                    q,
                    category,
                    size,
                    color,
                    style,
                    start,
                    end,
                    minPrice,
                    maxPrice,
                  }}
                  buttonText="Search dresses"
                />
              </form>
            </div>
          </div>
        </section>

        {/* Featured picks */}
        <section
          id="featured"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        >
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#463f3a] dark:text-slate-100">
              Featured picks
            </h2>
            <Link
              href="/search"
              className="text-sm text-[#463f3a] hover:underline dark:text-slate-200"
            >
              Browse all →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((item) => (
              <div
                key={item.id}
                className="group rounded-3xl bg-[#f4f3ee] overflow-hidden hover:shadow-md transition-shadow dark:bg-slate-900 dark:border dark:border-slate-800"
              >
                <div className="aspect-[3/4] relative">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                    priority={item.id === 1}
                  />
                  <div className="absolute inset-0 flex items-end p-4">
                    <span className="inline-flex items-center rounded-full bg-[#f4f3ee] px-2.5 py-1 max-h-6 text-xs font-medium text-[#463f3a]">
                      From ${item.price}/day
                    </span>
                  </div>
                </div>
                <div className="p-4 text-[#463f3a] dark:text-slate-100">
                  <p className="font-semibold">{item.name}</p>
                  <div className="mt-4">
                    <Link
                      href={`/items/${item.id}`}
                      className="inline-flex items-center rounded-full px-3 py-2 text-sm bg-[#bcb8b1] font-medium text-[#463f3a] hover:bg-[#8a817c] dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {featured.length === 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                No featured items match your filters.
              </p>
            )}
          </div>
        </section>

        {/* How it works */}
        <section
          id="how"
          className="bg-[#f4f3ee]/50 shadow-md dark:bg-slate-900/60"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#463f3a] dark:text-slate-100">
              How it works
            </h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-[#f4f3ee] p-6 text-center dark:bg-slate-900 dark:border dark:border-slate-800"
                >
                  <div className="mx-auto h-12 w-12 rounded-full bg-[#463f3a]/30 flex items-center justify-center text-2xl">
                    {s.emoji}
                  </div>
                  <h3 className="mt-4 font-semibold text-[#463f3a] dark:text-slate-100">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#463f3a] dark:text-slate-200">
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} GlamRent. All rights reserved.
          </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Contact us:</strong> glamrent@example.com
            </p>
        </div>
      </footer>
    </div>
  );
}
