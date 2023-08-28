function validateTime(timeStr) {
  // Define a regular expression pattern for the 24-hour time format
  const pattern = /^([01]\d|2[0-3]):[0-5]\d$/;

  if (!pattern.test(timeStr)) {
    return false;
  }

  // Split the time string into its hours and minutes components
  const [hours, minutes] = timeStr.split(":").map(Number);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return false;
  }

  return true;
}

module.exports = validateTime;
