import Image from "next/image";
import { notFound } from "next/navigation";
import {getItem, getItemRentals} from "../../../../lib/RentalManagementSystem";
import ItemCalendar from "./ItemCalendar";
import {getOrCreateCsrfToken} from "../../../../lib/CsrfSessionManagement";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Key } from "react";
import RentalForm from "./RentalForm";

export default async function ItemDetail({params}: { params: { id: string } }) {
  // `params` may be async in Next; await before using its properties.
  const p = await params;
  const id = Number(p.id);
    const item = getItem(id);
    if (!item) return notFound();

    // Generate CSRF token; cookie will be set if missing
    const csrf = await getOrCreateCsrfToken();

    const booked = await getItemRentals(id);

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <Image src={item.images[0]} alt={item.alt} fill className="object-cover" priority/>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                        {item.images.slice(1).map((src: Key | StaticImport | null | undefined) => (
                            <div key={`${src}-${item.id}`}
                                 className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <Image src={src as StaticImport} alt={item.alt} fill className="object-cover"/>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{item.name}</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 capitalize">{item.category}</p>
          <p className="mt-4">{item.description}</p>
          <p className="mt-4 font-semibold">From ${item.pricePerDay}/day</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Sizes: {item.sizes.join(", ")}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Color: {item.color}{item.style ? ` • Style: ${item.style}` : ""}</p>

          <div className="mt-8">
            <h2 className="font-semibold mb-3">Availability</h2>
            <ItemCalendar itemId={id} />
            {booked.length > 0 && (
              <p className="mt-2 text-xs text-slate-500">Dates marked are already booked.</p>
            )}
          </div>

          <div className="mt-10">
            <h2 className="font-semibold mb-3">Schedule a rental</h2>
            <RentalForm itemId={id} csrf={csrf} />
            <p className="mt-2 text-xs text-slate-500">No account required. We’ll confirm availability via email.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
