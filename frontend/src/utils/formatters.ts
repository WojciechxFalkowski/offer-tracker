export function formatDate(dateString: string): string {
    if (!dateString) return '-';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}
