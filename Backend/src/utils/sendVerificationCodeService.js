const emailTemplate = require("./generateEmailTemplate");
const sendEmail = require("./sendEmail");
const client = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

console.log("SID:", process.env.TTWILIO_SID);
console.log("TOKEN:", process.env.TWILIO_AUTH_TOKEN);


const sendVerificationCodeService = async (
  verificationMethod,
  verificationCode,
  email,
  phone,
) => {
  if (!verificationMethod) {
    throw new Error("Verification Method is required.");
  }

  if (verificationMethod === "email") {
    if (!email) {
      throw new Error("Email is required.");
    }

    const message = emailTemplate(verificationCode);

    await sendEmail({
      email,
      subject: "Your Verification Code",
      message,
    });

    return {
      success: true,
      message: `Verification code sent to ${email}`,
    };
  }

  if (verificationMethod === "phone") {
    if (!phone) {
      throw new Error("Phone number is required.");
    }

    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    const code = verificationCode.toString().split("").join(" ");

    console.log("verificationCode =", verificationCode);


    console.log("Yaha tk chl gya");

    await client.calls.create({
      twiml: `
        <Response>
          <Say>Your verification code is</Say>
          <Pause length="1"/>
          <Say>${code}</Say>
        </Response>
      `,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log("Yaha bhi chl gya");

    return {
      success: true,
      message: "OTP sent via call",
    };
  }

  throw new Error("Invalid Verification Method");
};

module.exports = sendVerificationCodeService;
