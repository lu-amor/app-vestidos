import Link from "next/link";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f3ee] to-[#bcb8b1] text-[#463f3a] dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      {/* Header SIEMPRE IGUAL */}
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

      {/* Main */}
      <main>
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#463f3a]/80 dark:text-slate-300/90">
              Everything you need to know before renting with GlamRent. If you
              still have questions, you can always reach out to us.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-[#f4f3ee] p-5 sm:p-6 shadow-sm border border-[#bcb8b1]/60 dark:bg-slate-900 dark:border-slate-700">
              <h2 className="font-semibold text-base sm:text-lg">
                How does the rental work?
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#463f3a]/90 dark:text-slate-200">
                Choose your garment, select the dates, and send the request. We
                will confirm availability and the next steps by email.
              </p>
            </div>

            <div className="rounded-3xl bg-[#f4f3ee] p-5 sm:p-6 shadow-sm border border-[#bcb8b1]/60 dark:bg-slate-900 dark:border-slate-700">
              <h2 className="font-semibold text-base sm:text-lg">
                Is cleaning included?
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#463f3a]/90 dark:text-slate-200">
                Yes, professional cleaning is included in all rentals. You just
                have to enjoy it and return it on time.
              </p>
            </div>

            <div className="rounded-3xl bg-[#f4f3ee] p-5 sm:p-6 shadow-sm border border-[#bcb8b1]/60 dark:bg-slate-900 dark:border-slate-700">
              <h2 className="font-semibold text-base sm:text-lg">
                How long can I rent?
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#463f3a]/90 dark:text-slate-200">
                You can usually rent between 2 and 7 days. If you need a longer
                period for a trip or event, contact us and we&apos;ll see what
                we can do.
              </p>
            </div>

            <div className="rounded-3xl bg-[#f4f3ee] p-5 sm:p-6 shadow-sm border border-[#bcb8b1]/60 dark:bg-slate-900 dark:border-slate-700">
              <h2 className="font-semibold text-base sm:text-lg">
                Do I need to create an account?
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#463f3a]/90 dark:text-slate-200">
                No. You can request a rental by filling out the form with your
                information and dates. Creating an account just makes future
                bookings faster.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} GlamRent. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
