const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const removeRsUnDataFormUser = require("../utils/removeRsUnDataFormUser");
const { hashPassword, passwordCompare } = require("./authService");

/**
 * Fetches user profile by ID.
 * @param {string} _id - The ID of the user to fetch the profile for.
 * @returns {Promise<Object>} The user profile object without sensitive data.
 * @throws {AppError} If the user is not found, throws a custom AppError with a 404 status.
 * @throws {AppError} If any other error occurs, throws a generic AppError with a 500 status.
 */
const userProfile = async (_id) => {
  try {
    // Find the user in the database by the provided ID
    const user = await User.findById(_id);
    if (!user) {
      // If the user is not found, throw a custom AppError with a 404 status
      throw new AppError(
        "User not found. Please check the provided ID or register for a new account.",
        404
      );
    }
    // If the user is found, remove sensitive data before returning the user profile
    return removeRsUnDataFormUser(user);
  } catch (error) {
    // Handle any errors that occur during the process
    if (error instanceof AppError) {
      // If the error is already an instance of AppError, rethrow it
      throw error;
    } else {
      // If the error is not an instance of AppError, throw a generic AppError with a 500 status
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

/**
 * Updates the user's profile information.
 * @param {string} id - The ID of the user to update.
 * @param {Object} data - The data containing the fields to update in the user's profile.
 * @returns {Promise<Object>} A Promise that resolves to the updated user information.
 * @throws {AppError} If the user with the provided ID is not found, an error with a 404 status will be thrown.
 * @throws {AppError} If any other error occurs during the process, a generic error with a 500 status will be thrown.
 */
const profileUpdate = async (id, data) => {
  try {
    // Find the user in the database by the provided ID
    const user = await User.findById(id);
    if (!user) {
      throw new AppError(
        "User not found. Please check the provided ID or register for a new account.",
        404
      );
    }

    if (data.email) {
      // Check if the provided email is already registered
      const findEmailUser = await User.findOne({ email: data.email });
      if (findEmailUser) {
        throw new AppError("This Email already registered", 404);
      }
    }

    // Update user properties with the provided data or keep the existing value if data is not provided
    user.name = data.name || user.name;
    user.email = data.email || user.email;
    user.avatar = data.avatar || user.avatar;

    // Save the updated user information back to the database
    const updateInfo = await user.save();

    // Remove sensitive and unnecessary data from the user before returning
    return removeRsUnDataFormUser(updateInfo);
  } catch (error) {
    // Handle any errors that occur during the process
    if (error instanceof AppError) {
      // If the error is already an instance of AppError, rethrow it
      throw error;
    } else {
      // If the error is not an instance of AppError, throw a generic AppError with a 500 status
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

/**
 * Updates the user's password.
 * @param {string} id - The ID of the user to update the password for.
 * @param {string} newPassword - The new password to set for the user.
 * @param {string} oldPassword - The old password for validation purposes.
 * @returns {Promise<Object>} A Promise that resolves to an object with a success message.
 * @throws {AppError} If the user with the provided ID is not found, an error with a 404 status will be thrown.
 * @throws {AppError} If the provided credentials are invalid (e.g., empty passwords or newPassword length less than 6 characters), an error with a 401 status will be thrown.
 * @throws {AppError} If the provided old password does not match the user's current password, an error with a 401 status will be thrown.
 * @throws {AppError} If any other error occurs during the password update process, a generic error with a 500 status will be thrown.
 */
const passwordUpdate = async (id, newPassword, oldPassword) => {
  try {
    // Find the user in the database by the provided ID
    const user = await User.findById(id);
    if (!user) {
      // If the user is not found, throw a custom AppError with a 404 status
      throw new AppError(
        "User not found. Please check the provided ID or register for a new account.",
        404
      );
    }

    // Check if provided credentials are valid (non-empty new and old passwords, and newPassword length >= 6)
    if (!newPassword || !oldPassword || !(newPassword.length >= 6)) {
      throw new AppError(
        "Invalid credentials. Please check your credentials and try again.",
        401
      );
    }

    // Compare the provided password with the stored hashed password for validation
    const isPasswordValid = await passwordCompare(oldPassword, user.password);

    if (!isPasswordValid) {
      // If the old password does not match the user's current password, throw a custom AppError with a 401 status
      throw new AppError(
        "Invalid password. Please check your credentials and try again.",
        401
      );
    }

    // Hash the new password before saving it to the database
    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword || user.password;

    // Save the updated user information back to the database
    await user.save();

    // Return an object with a success message
    return { message: "Password Update Successfully" };
  } catch (error) {
    // Handle any errors that occur during the process
    if (error instanceof AppError) {
      // If the error is already an instance of AppError, rethrow it
      throw error;
    } else {
      // If the error is not an instance of AppError, throw a generic AppError with a 500 status
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

/**
 * Add a reference to a sleipnerUser in a user document and return the updated user.
 * @param {string} userId - The ID of the user to whom the sleipnerUser will be added.
 * @param {string} sleipnerId - The ID of the sleipnerUser to be added to the user.
 * @returns {Promise<object>} - A Promise that resolves to the updated user document.
 * @throws {AppError} If the provided sleipnerUser ID is not found.
 * @throws {AppError} If an unexpected error occurs during the process.
 */
const addSleipner = async (userId, sleipnerId) => {
  try {
    // Find the sleipnerUser by its ID
    const sleipnerUser = await User.findById(sleipnerId);

    // Check if the sleipnerUser is not found
    if (!sleipnerUser) {
      throw new AppError(
        "Sleipner not found. Please check the provided ID",
        404
      );
    }

    // Use $addToSet to add the sleipner to the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { sleipner: sleipnerId } },
      { new: true }
    )
      .populate("sleipner", "name email avatar _id")
      .exec();

    // Check if the user is not found
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove sensitive data from the user and return the updated user
    return removeRsUnDataFormUser(updatedUser);
  } catch (error) {
    // Check if the error is an instance of AppError
    if (error instanceof AppError) {
      // If the error is already an instance of AppError, rethrow it
      throw error;
    } else {
      // If the error is not an instance of AppError, throw a generic AppError with a 500 status
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};
/**
 * Remove a sleipner reference from a user document and return a success message.
 *
 * @param {string} userId - The ID of the user from whom the sleipner will be removed.
 * @param {string} sleipnerId - The ID of the sleipner to be removed from the user.
 * @returns {Promise<{ message: string }>} - A Promise that resolves to a success message.
 * @throws {AppError} If an unexpected error occurs during the process.
 */
const deleteSlepiner = async (userId, sleipnerId) => {
  try {
    // Use the $pull operator to remove the sleipner from the user's sleipner array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { sleipner: sleipnerId } },
      { new: true }
    );

    // Check if the user is not found
    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    // Return a success message
    return { message: "Delete Successfully" };
  } catch (error) {
    // Check if the error is an instance of AppError
    if (error instanceof AppError) {
      // If the error is already an instance of AppError, rethrow it
      throw error;
    } else {
      // If the error is not an instance of AppError, throw a generic AppError with a 500 status
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

/**
 * Search for users based on a query string.
 *
 * @param {string} searchQuery - The query string to search for users.
 * @param {number} page - The page number for pagination.
 * @param {number} perPage - The number of users to return per page.
 * @returns {Promise<Array>} A Promise that resolves to an array of user objects.
 * @throws {AppError} If an error occurs during the search.
 */
const userSearch = async (searchQuery, page, perPage) => {
  try {
    // Calculate the number of documents to skip based on pagination parameters
    const skip = (page - 1) * perPage;

    const users = await User.find({
      $or: [
        { name: { $regex: `.*${searchQuery}.*`, $options: "i" } },
        { email: { $regex: `.*${searchQuery}.*`, $options: "i" } },
      ],
    })
      .skip(skip) // Skip the specified number of documents for pagination
      .limit(perPage) // Limit the number of documents returned per page
      .select("name avatar email"); // Select specific fields from the user documents

    // Return the array of user objects matching the search query
    return users;
  } catch (error) {
    // Check if the error is an instance of AppError
    if (error instanceof AppError) {
      // If the error is already an instance of AppError, rethrow it
      throw error;
    } else {
      // If the error is not an instance of AppError, throw a generic AppError with a 500 status
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

/**
 * Retrieves a specified number of Sleipner documents related to a user by their ID.
 *
 * @param {Object} options - An object containing options for retrieving Sleipner documents.
 * @param {string} options.id - The ID of the user whose Sleipner documents should be retrieved.
 * @param {number} options.skip - The number of Sleipner documents to skip before returning results.
 * @param {number} options.limit - The maximum number of Sleipner documents to return.
 * @returns {Promise<Array>} An array of Sleipner documents with selected fields (_id, email, avatar).
 * @throws {AppError} If there's an error during the retrieval process.
 */
const getAllSleipner = async ({ id, skip, limit }) => {
  try {
    // Find the user by their ID and populate the Sleipner field with selected fields.
    const user = await User.findById(id).populate({
      path: "sleipner",
      select: "_id email avatar",
      options: { skip, limit },
    });

    // Return the Sleipner documents.
    return user.sleipner;
  } catch (error) {
    // Handle errors
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

module.exports = {
  userProfile,
  profileUpdate,
  passwordUpdate,
  addSleipner,
  deleteSlepiner,
  userSearch,
  getAllSleipner,
};
