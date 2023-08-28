function validateDate(dateStr) {
  // Define a regular expression pattern for the expected format
  const pattern = /^\d{4}-\d{1,2}-\d{1,2}$/;

  if (!pattern.test(dateStr)) {
    return false;
  }

  // Split the date string into its components
  const [year, month, day] = dateStr.split("-").map(Number);

  // Create a new Date object using the components and check for validity
  const parsedDate = new Date(year, month - 1, day);
  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  );
}

module.exports = validateDate;
