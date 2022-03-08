const nodemailer = require("nodemailer")

const sendEmail = async options => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // 2) Defind the email options
    const mailOptions = {
        from: "nutella",
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    // 3) send email
    console.log(mailOptions)

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;