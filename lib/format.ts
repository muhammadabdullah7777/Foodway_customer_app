const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export const formatCurrency = (value: number) => currencyFormatter.format(value);

export const formatDateTime = (isoTimestamp: string) => dateFormatter.format(new Date(isoTimestamp));

export const formatShortDate = (isoTimestamp: string) => shortDateFormatter.format(new Date(isoTimestamp));

export const formatEta = (minutes: number) => `${minutes} min`;
