// "| 0" force integer math so we don't get floats
export const secondsToTime = (seconds) => {
  const roundSeconds = Math.ceil(seconds);
  const minutes = (roundSeconds / 60) | 0;
  const hours = (minutes / 60) | 0;
  const remainderMinutes = minutes % 60 | 0;

  let summary = "";
  if (hours > 0) summary += `${hours}h `;

  if (remainderMinutes > 0) summary += `${remainderMinutes}m`;

  return summary;
};
