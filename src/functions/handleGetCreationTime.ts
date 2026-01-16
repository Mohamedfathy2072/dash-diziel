export const handleGetCreationTime = (
  creationDate: string | number | Date
): string => {
  const lang =
    localStorage.getItem(`${import.meta.env.VITE_TOKEN_LANG_STORAGE}`) || "ar";
  const now = new Date();
  const createdAt = new Date(creationDate);
  const diffMs = now.getTime() - createdAt.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return lang === "ar"
      ? `منذ ${seconds} ثانية`
      : `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  }

  if (minutes < 60) {
    const unit = getUnit(minutes, "minute");
    return lang === "ar" ? `منذ ${minutes} ${unit}` : `${minutes} ${unit} ago`;
  }

  if (hours < 24) {
    const unit = getUnit(hours, "hour");
    return lang === "ar" ? `منذ ${hours} ${unit}` : `${hours} ${unit} ago`;
  }

  const unit = getUnit(days, "day");
  return lang === "ar" ? `منذ ${days} ${unit}` : `${days} ${unit} ago`;
};

function getUnit(value: number, unit: "minute" | "hour" | "day"): string {
  const lang =
    localStorage.getItem(`${import.meta.env.VITE_TOKEN_LANG_STORAGE}`) || "ar";
  if (lang === "en") {
    return value === 1 ? unit : `${unit}s`;
  }

  const pluralRules = new Intl.PluralRules("ar");
  const form = pluralRules.select(value);

  const arabicUnits = {
    minute: {
      zero: "دقائق",
      one: "دقيقة",
      two: "دقيقتين",
      few: "دقائق",
      many: "دقيقة",
      other: "دقيقة",
    },
    hour: {
      zero: "ساعات",
      one: "ساعة",
      two: "ساعتين",
      few: "ساعات",
      many: "ساعة",
      other: "ساعة",
    },
    day: {
      zero: "أيام",
      one: "يوم",
      two: "يومين",
      few: "أيام",
      many: "يوم",
      other: "يوم",
    },
  };

  return arabicUnits[unit][form];
}
