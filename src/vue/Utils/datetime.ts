
export function convertTimestamp(isoTimestamp: string) {

    const date = new Date(isoTimestamp);

    // Extract components
    const day = date.getUTCDate();
    const month = date.toLocaleString('en-US', { month: 'short' }); // e.g., "Nov"
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    // Convert 24-hour time to 12-hour time with AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12; // Adjust hour to 12-hour format

    // Format components as required
    const formatedDate = `${day} ${month} ${year} `;
    const formatedTime = `${hour12}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;

    return {formatedDate, formatedTime};
}



