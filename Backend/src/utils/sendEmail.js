const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `CodeByte <${process.env.SMTP_MAIL}>`,
      to: email,
      subject,
      html: message,
    });
  } catch (error) {
    console.error("Email send error:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
