const Invite = require("../models/inviteModal"); // Import the Invite model
const nodemailer = require("nodemailer");

/**
 * Send an email using Gmail.
 * @param {string} senderEmail - The sender's email address.
 * @param {string} emailbody - The HTML body of the email.
 * @returns {Promise<{ status: number, message: string }>} A Promise that resolves with
 * an object containing status and message on success, or rejects with an error.
 * @throws {AppError} If senderEmail or emailbody is missing, or if there's an error during
 * the email sending process.
 */
const sendMail = async (senderEmail, emailbody) => {
  try {
    if (!senderEmail) {
      throw new AppError("SenderEmail is required", 400);
    }
    if (!emailbody) {
      throw new AppError("Email Body is required", 400);
    }
    const config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    };

    const transporter = nodemailer.createTransport(config);

    const send = {
      from: `Daily Routine 💖🤖 ${process.env.SENDER_EMAIL}`,
      to: senderEmail,
      subject: "You are invited!",
      html: emailbody,
    };
    await transporter.sendMail(send);
    return { status: 200, message: "Invite sent successfully" };
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
  sendMail,
};
