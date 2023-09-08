const Invite = require("../models/inviteModal"); // Import the Invite model
const nodemailer = require("nodemailer");
const AppError = require("../utils/AppError");

/**
 * Send an email using Gmail.
 *
 * @param {object} options - Options for sending the email.
 * @param {string} options.resiveremail - The recipient's email address.
 * @param {string} options.emailbody - The HTML body of the email.
 * @param {string} options.subject - The subject of the email.
 * @returns {Promise<{ status: number, message: string }>} A Promise that resolves with
 * an object containing status and message on success, or rejects with an error.
 * @throws {AppError} If any of the required options are missing or if there's an error during
 * the email sending process.
 */
const sendMail = async ({ resiveremail, emailbody, subject }) => {
  try {
    // Check if required parameters are missing and throw an error if any are missing
    if (!resiveremail) {
      throw new AppError("resiveremail is required", 400);
    }
    if (!emailbody) {
      throw new AppError("emailbody is required", 400);
    }
    if (!subject) {
      throw new AppError("subject is required", 400);
    }

    // Configure the email service
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

    // Create a transporter to send the email
    const transporter = nodemailer.createTransport(config);

    // Define the email content
    const send = {
      from: `Daily Routine 💖🤖 ${process.env.SENDER_EMAIL}`,
      to: resiveremail,
      subject: subject,
      html: emailbody,
    };

    // Send the email
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
/**
 * Send an invitation email to a Slipner user.
 *
 * @param {object} options - Options for sending the invitation email.
 * @param {string} options.resiveremail - The recipient's email address.
 * @param {string} options.username - The username of the sender.
 * @param {string} options.userimage - The URL of the user's image.
 * @param {string} options.navigateLink - The URL to navigate to when the recipient clicks "JOIN."
 * @returns {Promise<{ status: number, message: string }>} A Promise that resolves with
 * an object containing status and message on success, or rejects with an error.
 * @throws {AppError} If any of the required options are missing or if there's an error during
 * the email sending process.
 */
const inviteSlipner = async ({
  resiveremail,
  username,
  userimage,
  navigateLink,
  message,
}) => {
  try {
    // Check if required parameters are missing and throw an error if any are missing
    if (!resiveremail) {
      throw new AppError("resiveremail is required", 400);
    }
    if (!username) {
      throw new AppError("username is required", 400);
    }
    if (!userimage) {
      throw new AppError("userimage is required", 400);
    }
    if (!navigateLink) {
      throw new AppError("navigateLink is required", 400);
    }

    // Create the HTML email body using provided information
    const templateBody = `
        <html>
    <h1 style="margin-left:20px">Hi</h1>
    <div style="display:flex;justify-content:start;margin-right:35px;gap:15px;align-items:center;margin-left:12px">
    <img src=${userimage} style="width:64px;height:64px;border-radius:50%" alt="" />
    <span style="font-size:40px">${username} has sent you an invitation!</span>
    </div> <p>${message ? message : ""}</p>
    <a target="_blank" href=${navigateLink} style="font-size:35px;text-align:center;width:full;background-color:#df5c43;padding:5px 20px;display:block;width:fit-content;margin:20px;color:white">JOIN</a </html>
    `;

    // Send the email using the sendMail function
    await sendMail({
      resiveremail: resiveremail,
      emailbody: templateBody,
      subject: "Join the Daily Routine",
    });

    return { message: "Invite sent successfully", status: 200 };
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
  inviteSlipner,
};
