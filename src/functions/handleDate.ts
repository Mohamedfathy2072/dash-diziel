export const handleDate = (
  date?: Date | string,
  time?: boolean,
  lang?: "ar" | "en",
  month: "long" | "numeric" = "long"
): string => {
  const l =
    lang ||
    localStorage.getItem(`${import.meta.env.VITE_TOKEN_LANG_STORAGE}`) ||
    "ar";
  let parsedDate: Date;

  if (!date) return "";

  if (typeof date === "string") {
    parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "";
  } else {
    parsedDate = date;
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month,
    day: "2-digit",
    ...(time && {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
  };

  const formattedDate = parsedDate.toLocaleDateString(
    l === "ar" ? "ar-EG" : "en-US",
    options
  );

  return formattedDate;
};
