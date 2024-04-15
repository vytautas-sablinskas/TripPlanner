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

export const getLocalTimeISOFromString = (date: any) => {
    const dateTime = DateTime.fromISO(date);
    const modifiedDateTime = dateTime.plus({ minutes: dateTime.offset });
    return modifiedDateTime.toJSDate().toISOString();
}

export const getLocalTimeISOFromDate = (date: any) => {
    const dateTime = DateTime.fromJSDate(date);
    const modifiedDateTime = dateTime.plus({ minutes: dateTime.offset });
    return modifiedDateTime.toJSDate().toISOString();
}

export const getLocalDate = (date: string) => {
    const localDateTime = DateTime.fromISO(date);
    const modifiedDateTime = localDateTime.plus({ minutes: localDateTime.offset });
    return modifiedDateTime.toJSDate();
}

export const getUtcTimeWithoutChangingTime = (date: any) => {
    const dateTime = DateTime.fromJSDate(date);

    const timeWithoutOffset = dateTime.setZone('utc', { keepLocalTime: true });

    const isoStringWithoutOffset = timeWithoutOffset.toISO();

    return isoStringWithoutOffset;
}

export const formatDateToString = (dateString : any, options: DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

export const getFormattedDateTime = (dateStr :any) => {
    const localDate = getLocalDate(dateStr);
    console.log(localDate);

}
