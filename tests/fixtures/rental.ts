import { formatISO, addDays } from '../testData/rentalUtils';

export type FillOptions = {
  name?: string;
  email?: string;
  phone?: string;
  startFromToday?: number; // días a partir del actual para el inicio de la reserva
  duration?: number;
};

export async function fillRentalForm(rental: any, opts: FillOptions = {}) {
  const name = opts.name ?? 'Juan';
  const email = opts.email ?? 'juan@example.com';
  const phone = opts.phone ?? '091123123';
  const startFromToday = opts.startFromToday ?? 1;
  const duration = opts.duration ?? 1;
  const today = new Date();
  const start = addDays(today, startFromToday); // el inicio de la reserva es hoy + startFromToday
  const end = addDays(start, duration); // el fin de la reserva es el inicio + duration

  await rental.fillForm({
    name,
    email,
    phone,
    start: formatISO(start),
    end: formatISO(end),
  });

  return { start, end };
}

export default fillRentalForm;
