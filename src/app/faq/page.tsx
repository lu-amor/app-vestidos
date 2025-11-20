import Link from "next/link";
import Topbar from "../../components/Topbar";

export default function FAQPage() {
  const faqs = [
    {
      q: "How do I rent an item?",
      a: "Search for an item, pick rental dates, and follow the checkout flow to reserve it.",
    },
    {
      q: "What is included with a rental?",
      a: "Free cleaning is included. Most rentals are 2–7 days — check the item details for exact rules.",
    },
    {
      q: "Can I change my rental dates?",
      a: "If the item is available for the new dates you can modify your rental — contact support for manual changes.",
    },
    {
      q: "How do I become a lender?",
      a: "Click the ‘Become a lender’ button in the header to start the onboarding process.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      <Topbar />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <article
              key={i}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
            >
              <h3 className="font-semibold text-lg">{f.q}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {f.a}
              </p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
