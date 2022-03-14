const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(" ")[0];
        this.url = url;
        this.form = `nutella <${process.env.EMAIL_FROM}>`
    }

    newTransport() {
        if(process.env.NODE_ENV === "production") {
            //sendgrid
            return 1;
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })        
    }

    // send the actual mail
    async send(template, subject) {
        // 1) Render HTML base on pug
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            fileName: this.fileName,
            url: this.url,
            subject
        });

        // 2) Define the email options
        const mailOptions = {
            from: this.form,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        }
        
        // 3) create transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send("Welcome", "Welcome to natours family!!!")
    }

    async sendPasswordReset() {
        await this.send("passwordReset", "Your password token only active for 10 minute")
    }
}