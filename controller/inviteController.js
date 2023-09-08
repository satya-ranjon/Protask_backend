const Invite = require("../models/inviteModal.js");
const emailService = require("../services/emailService.js");

/**
 * Handle the invitation of a Slipner user by sending an email invitation.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} A Promise that handles the invitation process and sends a response.
 */
const inviteSlipner = async (req, res, next) => {
  try {
    // Extract request body parameters
    const { resiveremail, username, userimage, navigateLink } = req.body;

    // Send an invitation email using the emailService
    const message = await emailService.inviteSlipner({
      resiveremail,
      username,
      userimage,
      navigateLink,
    });
    // const newInvite = new Invite({
    //   senderEmail: inviteData.senderEmail,
    //   recipientEmail: inviteData.recipientEmail,
    //   message: inviteData.message,
    //   status: customStatus, // Set the custom status here
    // });

    // await newInvite.save();

    // Respond with a success message
    return res.status(200).json(message);
  } catch (error) {
    // Forward errors to the error handling middleware
    next(error);
  }
};

module.exports = { inviteSlipner };
