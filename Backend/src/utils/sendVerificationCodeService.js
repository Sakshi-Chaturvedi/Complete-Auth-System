const emailTemplate = require("./generateEmailTemplate");
const sendEmail = require("./sendEmail");

const sendVerificationCodeService = async (
  verificationMethod,
  verificationCode,
  email,
  phone
) => {
  if (verificationMethod === "email") {
    const message = emailTemplate(verificationCode);
    await sendEmail(email, "CodeByte", message);
  } 
  else if (verificationMethod === "phone") {
    const verificationCodeWithSpace = verificationCode
      .toString()
      .split("")
      .join(" ");

    await client.calls.create({
      twiml: `<Response><Say>Your verification code is ${verificationCodeWithSpace}. Your verification code is ${verificationCodeWithSpace}.</Say></Response>`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
  } 
  else {
    throw new Error("Invalid Verification Method");
  }
};

module.exports = sendVerificationCodeService;