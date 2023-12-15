import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS,
    },
});

interface ISendMail {
    email: string;
    text: string;
    subject: string;
}

export const sendMail = async ({ email, text, subject }: ISendMail) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_MAIL,
            to: email,
            subject,
            text,
        })
    } catch (error) {
        console.log(`Error sending mail: ${ error }`)
    }
}