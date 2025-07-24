export function formatRelativeTime(date: Date) {
  const now = new Date();

  const diffInDays = Math.floor(
    (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) {
    return "posted today";
  } else if (diffInDays === 1) {
    return "posted yesterday";
  } else {
    return `posted ${diffInDays} days ago`;
  }
}
