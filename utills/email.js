const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.Email_Host,
    port: process.env.Email_PORT,
    secure: false,
    auth: {
      user: process.env.Email_USER_NAME,
      pass: process.env.Email_Passowrd,
    },
  });
  // defining mail options:
  const mailOptions = {
    from: "Ansh Soni <anshsoni743@gmail.com>",
    to: options.Email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
