
export function formatISO(d: Date) {
    return d.toISOString().slice(0, 10);
}

export function addDays(d: Date, days: number) {
    const nd = new Date(d);
    nd.setDate(nd.getDate() + days);
    return nd;
}
