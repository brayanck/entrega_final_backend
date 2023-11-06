const nodemailer = require("nodemailer");
const { MAIL_ID, MP } = require('../config/config');

const sendEmail = async (data) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: MAIL_ID,
                pass: MP,
            }
        });

        const info = await transporter.sendMail({
            from: '"Tienda" <abc@gmail.com>', 
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.html
        });

    } catch (error) {
        console.log("Error sending email:", error);
    }
};

module.exports = sendEmail;