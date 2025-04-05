/**
 * dd-mm-yyyy HH:mm:ss format
 * @param time
 * @returns
 */
export const formatTimeToDate = (time: string) => {
    const date = new Date(time);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    // const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
    // return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};
