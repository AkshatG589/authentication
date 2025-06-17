const nodemailer = require("nodemailer");

module.exports = async function sendOTPEmail(email, username, otp) {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: `"Auth App" <no-reply@example.com>`,
    to: email,
    subject: "Your OTP Code",
    text: `Hello ${username}, your OTP is ${otp}. It expires in 10 minutes.`,
  });

  return nodemailer.getTestMessageUrl(info);
};