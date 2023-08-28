const AppError = require("../utils/AppError");
const validateDate = require("../utils/validateDate");

const validateEventInput = (res, req, next) => {
  const { title, date, starttime, endtime } = req.body;

  const requiredFields = ["title", "date", "starttime"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    return next(
      new AppError(`${missingFields.join(", ")} are required fields.`, 400)
    );
  }
  if (!validateDate(date)) {
    return next(new AppError("Please input valid date! ", 400));
  }
};
