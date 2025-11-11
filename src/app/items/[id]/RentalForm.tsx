"use client";

import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  itemId: number;
  csrf: string;
};

export default function RentalForm({ itemId, csrf }: Props) {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget as HTMLFormElement);

    try {
      const res = await fetch("/api/rentals", {
        method: "POST",
        body: form,
        credentials: "same-origin",
      });

      // Successful handler: server redirects on success. Treat redirects (3xx)
      if (res.redirected || (res.status >= 300 && res.status < 400)) {
        toast.success("Request submitted — we will confirm via email.");
        // Optionally follow redirect after short delay
        setTimeout(() => {
          if (res.url) window.location.href = res.url;
        }, 1200);
      } else if (res.ok) {
        // Some servers may return 200 with JSON
        toast.success("Request submitted — we will confirm via email.");
      } else {
        let data: any = {};
        try {
          data = await res.json();
        } catch (err) {
          // ignore
        }
        const msg = data?.error || `Request failed (${res.status})`;
        toast.error(msg);
      }
    } catch (err: any) {
      toast.error(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-4xl bg-[#f4f3ee] p-4">
        <input type="hidden" name="itemId" value={itemId} />
        <input type="hidden" name="csrf" value={csrf} />
        <div className="sm:col-span-2">
          <label className="sr-only" htmlFor="name">Full name</label>
          <input id="name" name="name" required placeholder="Full name" className="w-full rounded-full px-6 py-3 text-sm input-field" />
        </div>
        <div>
          <label className="sr-only" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required placeholder="Email" className="w-full rounded-full px-6 py-3 text-sm input-field" />
        </div>
        <div>
          <label className="sr-only" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" required placeholder="Phone" className="w-full rounded-full px-6 py-3 text-sm input-field" />
        </div>
        <div>
          <label className="sr-only" htmlFor="start">Start date</label>
          <input id="start" name="start" type="date" required className="w-full rounded-full px-6 py-3 text-sm input-field" />
        </div>
        <div>
          <label className="sr-only" htmlFor="end">End date</label>
          <input id="end" name="end" type="date" required className="w-full rounded-full px-6 py-3 text-sm input-field" />
        </div>
        <div className="sm:col-span-2">
          <button disabled={loading} className="w-full sm:w-auto rounded-full bg-[#e0afa0] text-[#463f3a] px-6 py-3 text-sm font-semibold hover:bg-[#d19a8f]">
            {loading ? "Sending…" : "Request rental"}
          </button>
        </div>
      </form>

      <ToastContainer position="bottom-left" className="bg-green" toastClassName={"bg-green"} autoClose={3000} />
    </>
  );
}