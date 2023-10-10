/**
 * Formats a number with a specific number of digits.
 *
 * @param {number} n - The number to format.
 * @param {number} digits - The number of digits to display after the decimal point. Default is 2.
 * @return {string} The formatted number.
 */
const num_format = (n: number, digits: number = 2): string => {
    const number_formatter = new Intl.NumberFormat(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });

    return number_formatter.format(n);
};

/**
 * Format a UTC date string to a formatted date string.
 *
 * @param {string} utc_date_string - The UTC date string to format.
 * @return {string} The formatted date string.
 */
const format_date = (utc_date_string: string) : string => {
    const date = new Date(utc_date_string);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
}

/**
 * Parses the given value and returns a floating-point number representation.
 *
 * @param {string} value - The value to be parsed.
 * @return {any} - The parsed floating-point number.
 */
const parse_amount = (value: string): number | null => {
    const cleanedValue = value.trim().replace(/,/g, '');
    const val = parseFloat(cleanedValue);
    return isNaN(val) ? null : val;
};

/**
 * Parses a date string into a JavaScript Date object.
 *
 * @param {string} value - The date string to be parsed.
 * @param {string} dateFormat - The format of the date string (e.g. 'dd/mm/yyyy').
 * @return {Date | null} - The parsed date as a Date object, or null if the input is invalid.
 */
const parse_date = (value: string, dateFormat: string): Date | null => {

    const valueStr = value.trim();

    if (valueStr === '') {
        return null;
    }

    const parts = valueStr.split('/');

    if (parts.length !== 3) {
        return null;
    }

    const obj = {
        dd: dateFormat === 'dd/mm/yyyy' ? parts[0] : parts[1],
        mm: dateFormat === 'dd/mm/yyyy' ? parts[1] : parts[0],
        yyyy: parts[2].length === 4 ? parts[2] : `20${parts[2]}`,
    }

    const year = Number(obj.yyyy);
    const month = Number(obj.mm) - 1;
    const day = Number(obj.dd);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return null;
    }

    return new Date(year, month, day);
};

const compute_date_diff_in_days = (date1: Date, date2: Date): number => {
    const differenceInMilliseconds: number = date1.getTime() - date2.getTime();
    const differenceInDays: number = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    return differenceInDays;
}

export {
    num_format,
    parse_amount,
    parse_date,
    compute_date_diff_in_days,
    format_date,
}