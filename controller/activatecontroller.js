const Activate = require("../models/activatesModel");

/**
 * Get all activates for a specific user.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} A Promise that resolves with the list of activates or
 * rejects with an error.
 */
const getAllActivate = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const skips = (page - 1) * perPage;

    const activates = await Activate.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skips)
      .limit(perPage);

    res.status(200).json(activates);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllActivate };
