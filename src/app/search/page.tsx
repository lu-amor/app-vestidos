import Link from "next/link";
import Image from "next/image";
import { listItems, type Category } from "../../../lib/RentalManagementSystem";

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
    const { q = "", category = "", size = "", color = "", style = "" } = (await searchParams) || {};
    const items = await listItems({
        q,
        category: category || undefined,
        size: size || undefined,
        color: color || undefined,
        style: style || undefined,
    });

    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-30 backdrop-blur bg-[#463f3a]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-lg">
                    <Link href="/" className="font-extrabold text-xl tracking-tight text-[#e0afa0]">
                        GlamRent
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 text-sm text-[#f4f3ee]">
                        <Link href="/search" className="hover:text-[#e0afa0]">Browse</Link>
                        <Link href="/.#how" className="hover:text-[#e0afa0]">How it works</Link>
                        <Link href="/.#featured" className="hover:text-[#e0afa0]">Featured</Link>
                        <Link href="/faq" className="hover:text-[#e0afa0]">FAQ</Link>
                    </nav>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-full max-h-full px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-[#463f3a] text-2xl sm:text-3xl font-bold">Browse catalog</h1>
                    <form method="GET" className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                        <input name="q" defaultValue={q} placeholder="Search..." className="rounded-full bg-[#bcb8b1] px-3 py-2 text-sm focus:outline-[#463f3a]" />
                        <select name="category" defaultValue={category} className="rounded-full px-3 py-2 text-sm bg-[#bcb8b1] focus:outline-[#463f3a]" style={{WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none'}}>
                            <option value="">All categories</option>
                            <option value="dress">Dresses</option>
                            <option value="shoes">Shoes</option>
                            <option value="bag">Bags</option>
                            <option value="jacket">Jackets</option>
                        </select>
                        {(() => {
                            const sizesMap: Record<string, string[]> = {
                                dress: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                                shoes: ['35', '36', '37', '38', '39', '40', '41', '42'],
                                bag: ['Mini', 'Small', 'Medium', 'Large'],
                                jacket: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                            };
                        if (category) {
                            const opts = sizesMap[category as string] ?? [];
                            return (
                            <select
                                name="size"
                                defaultValue={size}
                                className="rounded-full px-3 py-2 text-sm bg-[#bcb8b1] focus:outline-[#463f3a]"
                                style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
                            >
                            <option value="">All sizes</option>
                            {opts.map((s) => (
                                <option key={s} value={s}>
                                {s}
                                </option>
                            ))}
                                </select>
                            );
                        }
                            return (
                                <input
                                name="size"
                                defaultValue={size}
                                placeholder="Size"
                                className="rounded-full bg-[#bcb8b1] px-3 py-2 text-sm focus:outline-[#463f3a]"
                                />
                            );
                        })()}
                        <input name="color" defaultValue={color} placeholder="Color" className="rounded-full bg-[#bcb8b1] px-3 py-2 text-sm focus:outline-[#463f3a]" />
                        <input name="style" defaultValue={style} placeholder="Style (e.g., cocktail)" className="rounded-full bg-[#bcb8b1] px-3 py-2 text-sm focus:outline-[#463f3a]" />
                        <button className="rounded-full bg-[#e0afa0] text-[#463f3a] font-semibold hover:bg-[#d7998c] px-4 py-2 text-sm">Search</button>
                    </form>
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {items.map((it) => (
                        <div key={it.id} className="rounded-2xl bg-[#f4f3ee] dark:bg-slate-900 overflow-hidden">
                            <div className="relative aspect-[3/4]">
                                <Image src={it.images[0]} alt={it.alt} fill className="object-cover" />
                                <div className="absolute inset-0 flex items-end p-4">
                                    <span className="inline-flex items-center rounded-full bg-[#f4f3ee] px-2.5 py-1 max-h-6 text-xs font-medium text-[#463f3a]">
                                        From ${it.pricePerDay}/day
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-xs uppercase tracking-wide text-[#463f3a]">{it.category}</p>
                                <p className="font-medium">{it.name}</p>
                                <p className="mt-1 text-sm text-[#463f3a]">Sizes: {it.sizes.join(", ")}</p>
                                <div className="mt-3">
                                    <Link
                                    href={`/items/${it.id}`}
                                    className="inline-flex items-center rounded-full px-3 py-2 text-sm bg-[#bcb8b1] font-medium text-[#463f3a] hover:bg-[#8a817c] hover:text-[#f4f3ee]"
                                    >
                                    View details
                                    </Link>
                                </div>
                            </div>
                        </div>
                        ))}
                        {items.length === 0 && (
                            <p className="text-sm text-slate-600 dark:text-slate-400">No items match your filters.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
