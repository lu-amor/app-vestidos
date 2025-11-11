"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = { itemId: number };

type Range = { start: string; end: string };

function toISO(d: Date) {
    return d.toISOString().slice(0, 10);
}

export default function ItemCalendar({ itemId }: Props) {
  const [busy, setBusy] = useState<Range[]>([]);
  const [selection, setSelection] = useState<{ start?: string; end?: string }>({});
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/items/${itemId}/availability`)
      .then((r) => r.json())
      .then((data) => {
        // Normalize returned rental dates so we compare plain yyyy-mm-dd strings.
        // Some consumers may return full ISO datetimes (e.g. 2025-11-12T00:00:00.000Z)
        // and we only need the date portion. Safely slice to 10 chars.
        const normalized = (data.rentals ?? []).map((r: any) => ({
          start: (r.start ?? "").toString().slice(0, 10),
          end: (r.end ?? "").toString().slice(0, 10),
        }));
        setBusy(normalized);
      })
  }, [itemId]);

  const today = new Date();
  // Show next 60 days
  const days = Array.from({ length: 60 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  function isBooked(date: Date) {
    const iso = toISO(date);
    console.log("Checking booked for", iso, busy);
    return busy.some((r) => r.start <= iso && iso <= r.end);
  }

  function handleClick(date: Date) {
    const iso = toISO(date);
    const { start, end } = selection;

    // No start yet -> set start
    if (!start) {
      setSelection({ start: iso });
      return;
    }

    // Start exists, no end -> set end (ensure start <= end)
    if (start && !end) {
      if (iso === start) {
        // clicking same date keeps it as start
        setSelection({ start: iso });
        return;
      }
      if (iso < start) {
        // clicked earlier -> swap so start <= end
        setSelection({ start: iso, end: start });
      } else {
        setSelection({ start, end: iso });
      }
      return;
    }

    // Both start and end already set -> start a new selection with clicked date
    setSelection({ start: iso });
  }

  function isInSelection(date: Date) {
    const iso = toISO(date);
    const { start, end } = selection;
    if (start && end) return start <= iso && iso <= end;
    if (start && !end) return iso === start;
    return false;
  }

  // Keep the request form's date inputs in sync with calendar selection.
  useEffect(() => {
    // IDs from `src/app/items/[id]/page.tsx` form inputs
    const startInput = document.getElementById("start") as HTMLInputElement | null;
    const endInput = document.getElementById("end") as HTMLInputElement | null;

    if (startInput) {
      startInput.value = selection.start ?? "";
      // also set min to today to prevent picking earlier dates in the form
      startInput.min = toISO(new Date());
    }

    if (endInput) {
      endInput.value = selection.end ?? "";
      // when start is present, make sure end can't be earlier than start
      if (selection.start) {
        endInput.min = selection.start;
      } else {
        endInput.min = toISO(new Date());
      }
    }
  }, [selection]);

  function rentIt() {
    setVerifyMessage(null);
    const { start, end } = selection;
    if (!start || !end) {
      setVerifyMessage("Please select a start and end date before renting.");
      return;
    }

    // Check for any overlap between selection and busy ranges
    const conflict = busy.some((r) => !(r.end < start || r.start > end));

    if (conflict) {
      setVerifyMessage("Selected dates conflict with existing rentals.");
      try {
        toast.error("Selected dates conflict with existing rentals.");
      } catch (e) {}
    } else {
      setVerifyMessage("Dates are available — OK to rent.");
      try {
        toast.success("Dates are available — OK to rent.");
      } catch (e) {}
      // TODO: POST to create rental if desired
    }
  }

  return (
    <div>
      {/* Weekday header starting Monday */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
        <div>Sun</div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {(() => {
          // Compute leading blanks so the first day lines up under the correct weekday (Monday-first)
          const first = days[0];
          const weekdayIndex = (first.getDay() + 6) % 7; // Monday=0 .. Sunday=6
          const blanks = Array.from({ length: weekdayIndex });

          return (
            <>
              {blanks.map((_, i) => (
                <div key={`empty-${i}`} className="text-center text-xs rounded-md px-2 py-3 bg-transparent" />
              ))}

              {days.map((d) => {
                const iso = toISO(d);
                const booked = isBooked(d);
                const inSelection = isInSelection(d);
                const isStart = selection.start === iso;
                const isEnd = selection.end === iso;

                let classes =
                  "text-center text-xs rounded-md px-2 py-3 ";

                if (booked) {
                  // Make booked dates clearly red with good contrast in light/dark modes
                  classes += "bg-rose-600 text-white dark:bg-rose-500 dark:text-white";
                } else if (isStart || isEnd) {
                  classes += "bg-indigo-600 text-white dark:bg-indigo-500";
                } else if (inSelection) {
                  classes += "bg-indigo-100 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-100";
                } else {
                  classes += "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100";
                }

                return (
                  <button
                    key={d.toISOString()}
                    title={iso}
                    onClick={() => handleClick(d)}
                    className={classes}
                  >
                    {d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    <div className="mt-1">
                      {booked ? "Booked" : isStart ? "Start" : isEnd ? "End" : ""}
                    </div>
                  </button>
                );
              })}
            </>
          );
        })()}
      </div>
    </div>
  );
}
