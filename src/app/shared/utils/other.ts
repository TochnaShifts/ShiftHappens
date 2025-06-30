export function getDurationHours(start: Date, end: Date): number {
    const diffMs = end.getTime() - start.getTime(); // Difference in milliseconds
    const diffHours = diffMs / (1000 * 60 * 60);    // Convert to hours
    return Math.round(diffHours * 10) / 10;         // Round to 1 decimal place
  }
  
  export function formatTimeRange(start: Date, end: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24-hour format
    };
  
    const startTime = start.toLocaleTimeString('he-IL', options);
    const endTime = end.toLocaleTimeString('he-IL', options);
  
    return `${startTime} - ${endTime}`;
  }

  export const getStartOfMonth = (): Date => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  }

  export const getEndOfMonth = (): Date => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59));
  }