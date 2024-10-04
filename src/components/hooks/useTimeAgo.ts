import { useState, useEffect } from "react";
import { getTimeDifference } from "../../utils/getTimeDifference";

// The custom hook
export function useTimeAgo(postedTime: Date): string {
  const [timeAgo, setTimeAgo] = useState(getTimeDifference(postedTime));

  useEffect(() => {
    // Update the "time ago" value every minute
    const interval = setInterval(() => {
      setTimeAgo(getTimeDifference(postedTime));
    }, 120000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [postedTime]);

  return timeAgo;
}
