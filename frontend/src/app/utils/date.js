const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MIDNIGHT_ISO_PATTERN = /^(\d{4}-\d{2}-\d{2})T00:00:00(?:\.000)?(?:Z|[+-]\d{2}:?\d{2})?$/;

const pad = (value) => String(value).padStart(2, '0');

const toLocalDate = (value) => {
    if (value instanceof Date) {
        return value;
    }

    if (typeof value === 'string' && DATE_ONLY_PATTERN.test(value)) {
        const [year, month, day] = value.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    if (typeof value === 'string') {
        const midnightMatch = value.match(MIDNIGHT_ISO_PATTERN);
        if (midnightMatch) {
            const [year, month, day] = midnightMatch[1].split('-').map(Number);
            return new Date(year, month - 1, day);
        }
    }

    return new Date(value);
};

const formatDate = (value, options) => {
    if (!value) return '';

    const date = toLocalDate(value);
    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleDateString(undefined, options);
};

const toDateInputValue = (value) => {
    if (!value) return '';

    const date = toLocalDate(value);
    if (Number.isNaN(date.getTime())) return '';

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export { formatDate, toDateInputValue };
