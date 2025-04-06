import { holidays } from "./holidays.js";

export function getHoliday(date = new Date()) {
  // in JS w/out timezone concept, returns in UTC
  const datakey = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`; // MM-DD in local
  let template = holidays[datakey];
  if (!template) return "";
  const title =
    template?.title
      ?.replace("{year}", date.getFullYear())
      ?.replace("{nextyear}", date.getFullYear() + 1) ?? "error";
  const description =
    template?.description
      ?.replace("{year}", date.getFullYear())
      ?.replace("{nextyear}", date.getFullYear() + 1) ?? "error";

  return { title, description };
}
