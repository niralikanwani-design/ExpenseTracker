export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const getDateRange = (range: string): { start: string; end: string } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (range) {
    case "today":
      return {
        start: today.toISOString(),
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      };
    case "week": {
      const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return {
        start: weekStart.toISOString(),
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      };
    }
    case "month": {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      return {
        start: monthStart.toISOString(),
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      };
    }
    case "year": {
      const yearStart = new Date(today.getFullYear(), 0, 1);
      return {
        start: yearStart.toISOString(),
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      };
    }
    default:
      return {
        start: new Date(0).toISOString(),
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      };
  }
};

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};
