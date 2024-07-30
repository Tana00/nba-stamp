export const dateTimeToEpoch = (dateTimeStr) => {
  // Create a Date object from the date-time string
  const date = new Date(dateTimeStr);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date-time string");
  }

  // Convert the date to Unix epoch time (in seconds)
  return Math.floor(date.getTime() / 1000);
};
