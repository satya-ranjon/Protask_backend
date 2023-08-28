const AppError = require("../utils/AppError");
const validateDate = require("../utils/validateDate");
const validateTime = require("../utils/validateTime");

const validateEventInput = (req, _res, next) => {
  // Destructure the required fields from the request body
  const { date, starttime, endtime } = req.body;

  // Define the list of required fields
  const requiredFields = ["title", "date", "starttime"];

  // Find missing required fields
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  // If any required fields are missing, return an error
  if (missingFields.length > 0)
    return next(
      new AppError(`${missingFields.join(", ")} are required fields.`, 400)
    );

  // Validate the date format using the validateDate function
  if (!validateDate(date))
    return next(new AppError("Please input valid date! 2023-8-1", 400));

  // Validate the start time format using the validateTime function
  if (!validateTime(starttime))
    return next(new AppError("Please input valid start Time! 23:59", 400));

  // Validate the end time format using the validateTime function
  if (!validateTime(endtime))
    return next(new AppError("Please input valid end Time! 23:59", 400));

  // If all validations pass, move on to the next middleware
  next();
};

module.exports = validateEventInput;
