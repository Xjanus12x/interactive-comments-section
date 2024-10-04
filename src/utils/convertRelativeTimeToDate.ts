export function convertRelativeTimeToDate(relativeTime: string): Date | null {
  const currentDate = new Date();

  // Updated regular expression to handle singular/plural and optional whitespace
  const timePattern = /(\d+)\s(\w+?)\sago/;
  const match = relativeTime.match(timePattern);

  if (!match) {
    console.error("Invalid relative time format");
    return null;
  }

  const value = parseInt(match[1], 10); // Extract the number
  const unit = match[2].toLowerCase(); // Extract and normalize the time unit

  switch (unit) {
    case "second":
    case "seconds":
      currentDate.setSeconds(currentDate.getSeconds() - value);
      break;
    case "minute":
    case "minutes":
      currentDate.setMinutes(currentDate.getMinutes() - value);
      break;
    case "hour":
    case "hours":
      currentDate.setHours(currentDate.getHours() - value);
      break;
    case "day":
    case "days":
      currentDate.setDate(currentDate.getDate() - value);
      break;
    case "week":
    case "weeks":
      currentDate.setDate(currentDate.getDate() - value * 7);
      break;
    case "month":
    case "months":
      currentDate.setMonth(currentDate.getMonth() - value);
      break;
    case "year":
    case "years":
      currentDate.setFullYear(currentDate.getFullYear() - value);
      break;
    default:
      console.error("Invalid time unit");
      return null;
  }

  return currentDate;
}
