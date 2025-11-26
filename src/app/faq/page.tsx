import Link from "next/link";

export default function Page() {
    return (
    <div>
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
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl sm:text-3xl font-bold">Frequently Asked Questions</h1>
        <div className="mt-6 space-y-6">
            <div>
            <h2 className="font-semibold">How does the rental work?</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
                Choose your garment, select the dates, and send the request. We will confirm availability and the next steps by email.
            </p>
            </div>
            <div>
            <h2 className="font-semibold">Is cleaning included?</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Yes, cleaning is included in all rentals.</p>
            </div>
            <div>
            <h2 className="font-semibold">How long can I rent?</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Between 2 and 7 days. If you need more time, contact us.</p>
            </div>
            <div>
            <h2 className="font-semibold">Do I need to create an account?</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">No. Just fill out the form with your information and dates.</p>
            </div>
        </div>
        </div>
    </main>
    </div>
);
}
