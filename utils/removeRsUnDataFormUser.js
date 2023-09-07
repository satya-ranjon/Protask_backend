/**
 * Removes the password field from the user object.
 * @param {Object} user - The user object.
 * @returns {Object} A new user object without the password field.
 */
const removeRsUnDataFormUser = (user) => {
  const userWithoutPassword = { ...user.toObject() };
  delete userWithoutPassword.password;
  delete userWithoutPassword.createdAt;
  delete userWithoutPassword.updatedAt;
  delete userWithoutPassword.tags;
  delete userWithoutPassword.__v;
  delete userWithoutPassword.sleipner;
  return userWithoutPassword;
};

module.exports = removeRsUnDataFormUser;
