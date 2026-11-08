interface Dated {
    data: { year: string; month?: string | null };
}

const monthIndex = (month?: string | null) =>
    month ? new Date(`${month} 1, 2000`).getMonth() : -1;

/** Sorts by year, then month where one is known, with the newest entries first. */
export const newestFirst = <T extends Dated>(items: T[]) =>
    items.toSorted(
        (a, b) =>
            b.data.year.localeCompare(a.data.year) ||
            monthIndex(b.data.month) - monthIndex(a.data.month),
    );
