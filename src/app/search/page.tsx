import Link from "next/link";
import Image from "next/image";
import {listItems, listColors, type Category} from "../../../lib/RentalManagementSystem";
import SearchFilters from "../../components/SearchFilters";

type SearchParams = {
  q?: string;
  category?: Category | "";
  size?: string;
  color?: string;
  style?: string;
  start?: string;
  end?: string;
};

export default async function Page({ searchParams }: { searchParams: any }) {
  const {
    q = "",
    category = "",
    size = "",
    color = "",
    style = "",
    start = "",
    end = "",
  } = (await searchParams) || {};

  const items = await listItems({
    q,
    category: category || undefined,
    size: size || undefined,
    color: color || undefined,
    style: style || undefined,
  });

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
            <Link href="/#how" className="hover:text-[#e0afa0]">
              How it works
            </Link>
            <Link href="/#featured" className="hover:text-[#e0afa0]">
              Featured
            </Link>
            <Link href="/faq" className="hover:text-[#e0afa0]">
              FAQ
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#463f3a] dark:text-slate-100">
            Browse catalog
          </h1>

          <div className="mt-6">
            <SearchFilters
              defaults={{
                q,
                category,
                size,
                color,
                style,
                start: start,
                end: end,
              }}
              buttonText="Search dresses"
              compact={true}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((it) => (
              <div
                key={it.id}
                data-testid="item-card"
                data-color={it.color} 
                className="rounded-3xl bg-[#f4f3ee] dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={it.images[0]}
                    alt={it.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-end p-4">
                    <span className="inline-flex items-center rounded-full bg-[#f4f3ee] px-2.5 py-1 max-h-6 text-xs font-medium text-[#463f3a]">
                      From ${it.pricePerDay}/day
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-wide text-[#463f3a] dark:text-slate-300">
                    {it.category}
                  </p>
                  <p className="mt-1 font-semibold text-[#463f3a] dark:text-slate-100">
                    {it.name}
                  </p>
                  <p className="mt-1 text-sm text-[#463f3a] dark:text-slate-300">
                    Sizes: {it.sizes.join(", ")}
                  </p>
                  <div className="mt-3">
                    <Link
                      href={`/items/${it.id}`}
                      className="inline-flex items-center rounded-full px-3 py-2 text-sm bg-[#bcb8b1] font-medium text-[#463f3a] hover:bg-[#8a817c] hover:text-[#f4f3ee] dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
      div       No items match your filters.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
