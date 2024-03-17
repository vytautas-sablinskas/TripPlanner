import { DateTime, DateTimeFormatOptions } from "luxon";

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

export const getLocalTime = (date: any) => {
    const localDateTime = DateTime.fromISO(date).toUTC();
    return localDateTime.toJSDate().toISOString();
}

export const formatDateToString = (dateString : any, options: DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}
