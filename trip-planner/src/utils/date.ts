import { DateTime } from "luxon";

export const getFormattedDateRange = (startStr: string, endStr: string): string => {
    const startDate = DateTime.fromISO(startStr, { zone: 'utc' });
    const endDate = DateTime.fromISO(endStr, { zone: 'utc' });

    const startDateLocal = startDate.setZone('local');
    const endDateLocal = endDate.setZone('local');

    const startFormatted = startDateLocal.toFormat("LLL dd");
    const endFormatted = endDateLocal.toFormat("LLL dd, yyyy");

    const dateString = `${startFormatted} - ${endFormatted}`;

    return dateString;
}

export const getUtcTime = (date: any) => {
    return DateTime.fromJSDate(date).toUTC().toISO();
}