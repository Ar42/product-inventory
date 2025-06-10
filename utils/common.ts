import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

interface FormatDateOptions {
  showTime?: boolean;
  timeFormat?: "12" | "24";
  locale?: string;
}

export const CONFIG = {
  pagination_max_size: 12,
};

export const formatPrice = (price: number) => {
  const currencySymbol = "$";
  const formattedPrice = `${currencySymbol}${price}`;
  return formattedPrice;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (
  dateString: string,
  options: FormatDateOptions = {}
): string => {
  const { showTime = false, timeFormat = "12", locale = "en-US" } = options;

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  if (showTime) {
    dateOptions.hour = "2-digit";
    dateOptions.minute = "2-digit";
    dateOptions.hour12 = timeFormat === "12";
  }

  return new Date(dateString).toLocaleDateString(locale, dateOptions);
};

export const arrayToParam = <V>(values: V[]): string | null => {
  if (!values.length) return null;
  return `${values.map(String).join("&")}`;
};

export const getValidImageUrl = (
  imageUrl: string | null | undefined
): string => {
  const placeImageUrl = "/images/no-image.png";
  if (!imageUrl) return placeImageUrl;

  const validExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "svg",
    "bmp",
    "tiff",
    "ico",
    "avif",
  ];

  const lowerUrl = imageUrl.toLocaleLowerCase();

  const imageExtension = lowerUrl.split(".").at(-1);
  const hasValidExtension = validExtensions.some(
    (ext) => imageExtension === ext
  );

  return hasValidExtension ? imageUrl : placeImageUrl;
};

export const updateOffset = (currentPageNo: number) => {
  return (currentPageNo - 1) * CONFIG.pagination_max_size;
};

export const beautifyText = (input: string): string => {
  return input
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

function formatRelativeTime(date: Date | string | number): string {
  const now = new Date();
  const targetDate = new Date(date);

  const diffMs = now.getTime() - targetDate.getTime();

  if (diffMs < 0) {
    return "just now";
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30.44);
  const diffYears = Math.floor(diffDays / 365.25);

  if (diffSeconds < 60) {
    return `${diffSeconds} second${diffSeconds === 1 ? "" : "s"} ago`;
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  if (diffHours < 24) {
    if (diffHours === 1) {
      return "1 hour ago";
    }
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  if (diffDays < 30) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
  }

  return `${diffYears} year${diffYears === 1 ? "" : "s"} ago`;
}

export { formatRelativeTime };
