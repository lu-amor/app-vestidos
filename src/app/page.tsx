import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const featured = [
    { id: 1, name: "Silk Evening Gown", price: 79, image: "/images/dresses/silk-evening-gown.jpg", alt: "Model wearing a champagne silk evening gown" },
    { id: 2, name: "Black Tie Dress", price: 99, image: "/images/dresses/black-tie-dress.jpg", alt: "Elegant black tie dress" },
    { id: 3, name: "Floral Midi Dress", price: 49, image: `/images/dresses/floral-midi-dress.jpg`, alt: "Floral midi dress perfect for daytime events" },
    { id: 4, name: "Velvet Cocktail Dress", price: 59, image: "/images/dresses/velvet-cocktail-dress.jpg", alt: "Velvet cocktail dress in deep tones" },
  ];

  const steps = [
    { emoji: "🔍", title: "Browse", text: "Find styles by size, color, designer, or occasion." },
    { emoji: "📅", title: "Rent", text: "Pick dates and get it delivered to your door." },
    { emoji: "📦", title: "Return", text: "Wear, wow, and send it back—cleaning included." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f3ee] to-[#bcb8b1] text-[#463f3a]">
      <header className="sticky top-0 z-30 backdrop-blur bg-[#463f3a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-lg">
          <Link href="/" className="font-extrabold text-xl tracking-tight text-[#e0afa0]">
            GlamRent
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#f4f3ee]">
            <Link href="/search" className="hover:text-[#e0afa0]">Browse</Link>
            <Link href="#how" className="hover:text-[#e0afa0]">How it works</Link>
            <Link href="#featured" className="hover:text-[#e0afa0]">Featured</Link>
            <Link href="/faq" className="hover:text-[#e0afa0]">FAQ</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                Rent designer dresses for every
                <span className="mx-2 bg-gradient-to-r from-[#463f3a] to-[#e0afa0] bg-clip-text text-transparent">occasion</span>.
              </h1>
              <p className="mt-6 text-base sm:text-lg text-[#463f3a]">
                Look stunning without the price tag. Flexible rentals, free cleaning, and fast delivery.
              </p>

              <form action="/search" method="GET" className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 rounded-3xl bg-[#8a817c] p-4 shadow-sm">
                <div className="col-span-1 lg:col-span-2">
                  <label htmlFor="query" className="sr-only">Search</label>
                  <input
                    id="query"
                    name="q"
                    type="text"
                    placeholder="Search by style, color, or designer"
                    className="w-full rounded-full bg-[#f4f3ee] px-4 py-3 text-sm outline-none placeholder:text-[#463f3a]"
                  />
                </div>
                <div>
                  <label htmlFor="start" className="sr-only">Start date</label>
                  <input
                    id="start"
                    name="start"
                    type="date"
                    className="w-full rounded-full bg-[#f4f3ee] px-4 py-3 text-sm outline-none placeholder:text-[#463f3a]"
                  />
                </div>
                <div>
                  <label htmlFor="end" className="sr-only">End date</label>
                  <input
                    id="end"
                    name="end"
                    type="date"
                    className="w-full rounded-full bg-[#f4f3ee] px-4 py-3 text-sm outline-none placeholder:text-[#463f3a]"
                  />
                </div>
                <div>
                  <label htmlFor="size" className="sr-only">Size</label>
                  <select
                    id="size"
                    name="size"
                    className="w-full rounded-full bg-[#f4f3ee] px-4 py-3 text-sm outline-none placeholder:text-[#463f3a]"
                    style={{WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none'}}
                  >
                    <option value="">Any size</option>
                    <option>XS</option>
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                  </select>
                </div>
                <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex items-center justify-end">
                    <button
                        type="submit"
                        className="w-[200px] inline-flex items-center justify-center rounded-full bg-[#e0afa0] px-6 py-3 text-sm font-semibold text-[#463f3a] hover:bg-[#c48b8b]"
                    >
                        Search dresses
                    </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section id="featured" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Featured picks</h2>
            <Link href="/search" className="text-sm text-[#463f3a] hover:underline">Browse all →</Link>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((item) => (
              <div
                key={item.id}
                className="group rounded-3xl bg-[#f4f3ee] overflow-hidden hover:shadow-md transition-shadow"
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
                  <div className="absolute inset-0 flex items:end p-4">
                    <span className="inline-flex items-center rounded-full bg-[#f4f3ee] px-2.5 py-1 max-h-6 text-xs font-medium text-[#463f3a]">
                      From ${item.price}/day
                    </span>
                  </div>
                </div>
                <div className="p-4 text-[#463f3a]">
                  <p className="font-semibold">{item.name}</p>
                  <div className="mt-4">
                    <Link
                      href={`/items/${item.id}`}
                      className="inline-flex items-center rounded-full px-3 py-2 text-sm bg-[#bcb8b1] font-medium text-[#463f3a] hover:bg-[#8a817c]"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="how" className="bg-[#f4f3ee]/50 shadow-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center">How it works</h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {steps.map((s, i) => (
                <div key={i} className="rounded-3xl bg-[#f4f3ee] p-6 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-[#463f3a]/30 flex items-center justify-center text-2xl">{s.emoji}</div>
                  <h3 className="mt-4 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-[#463f3a]">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">© {new Date().getFullYear()} GlamRent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
