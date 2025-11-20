import Image from "next/image";
import Link from "next/link";
import SearchFormClient from "./search/SearchFormClient";
import Topbar from "../components/Topbar";

export default function Home() {
  const featured = [
    {
      id: 1,
      name: "Silk Evening Gown",
      price: 79,
      image: "/images/dresses/silk-evening-gown.jpg",
      alt: "Model wearing a champagne silk evening gown",
    },
    {
      id: 2,
      name: "Black Tie Dress",
      price: 99,
      image: "/images/dresses/black-tie-dress.jpg",
      alt: "Elegant black tie dress",
    },
    {
      id: 3,
      name: "Floral Midi Dress",
      price: 49,
      image: `/images/dresses/floral-midi-dress.jpg`,
      alt: "Floral midi dress perfect for daytime events",
    },
    {
      id: 4,
      name: "Velvet Cocktail Dress",
      price: 59,
      image: "/images/dresses/velvet-cocktail-dress.jpg",
      alt: "Velvet cocktail dress in deep tones",
    },
  ];

  const steps = [
    {
      emoji: "🧭",
      title: "Browse",
      text: "Find styles by size, color, designer, or occasion.",
    },
    {
      emoji: "📦",
      title: "Rent",
      text: "Pick dates and get it delivered to your door.",
    },
    {
      emoji: "✨",
      title: "Return",
      text: "Wear, wow, and send it back—cleaning included.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      <Topbar />

      <main>
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                Rent designer dresses for every
                <span className="mx-2 bg-gradient-to-r from-fuchsia-600 via-rose-500 to-orange-400 bg-clip-text text-transparent">
                  occasion
                </span>
                .
              </h1>
              <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300">
                Look stunning without the price tag. Flexible rentals, free
                cleaning, and fast delivery.
              </p>

              <SearchFormClient searchParams={{}} />
            </div>
          </div>
        </section>

        <section
          id="featured"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        >
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Featured picks</h2>
            <Link
              href="/search"
              className="text-sm text-fuchsia-600 hover:underline"
            >
              Browse all →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-[3/4] relative bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                    priority={item.id === 1}
                  />
                  <div className="absolute inset-0 flex items:end p-4">
                    <span className="inline-flex items-center rounded-full bg-white/85 dark:bg-slate-800/80 backdrop-blur px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-100">
                      From ${item.price}/day
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-medium">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Free cleaning • 2–7 day rentals
                  </p>
                  <div className="mt-4">
                    <Link
                      href={`/items/${item.id}`}
                      className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="how"
          className="bg-slate-50/70 dark:bg-slate-900/60 border-y border-slate-200/60 dark:border-slate-800"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center">
              How it works
            </h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center"
                >
                  <div className="mx-auto h-12 w-12 rounded-full bg-fuchsia-600/10 flex items-center justify-center text-2xl">
                    {s.emoji}
                  </div>
                  <h3 className="mt-4 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Join our newsletter
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Get style tips, drops, and exclusive offers.
              </p>
            </div>
            <form
              action="/api/newsletter"
              method="POST"
              className="flex w-full gap-3"
            >
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="flex-1 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
              <button className="inline-flex items-center rounded-xl bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white hover:bg-fuchsia-500">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} GlamRent. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/terms" className="hover:text-fuchsia-600">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-fuchsia-600">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-fuchsia-600">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
