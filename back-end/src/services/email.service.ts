import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

// SMTo -> Provider email pengirim 
// Set up SMTP logic 
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendWelcomeEmail(to: string) {
    await transporter.sendMail({
        from: "Event Hub",
        to, 
        subject: " Explore your Event Activitiy",
        html: "", //minta di chat gpt saja dengan prompt "tolong buatkan template html terpisah dengan styling menggunakan css native"
        //setelah itu copy dan masukkan kedalam folder "templates" dengan nama "welcome-email-template.ts"
    });
}