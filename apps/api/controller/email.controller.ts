import { Request, Response } from "express";
import nodemailer from "nodemailer";
import contactEmailTemplate from "../template/contactEmailTemplate";
import clientReplyTemplate from "../template/clientReplyTemplate";

export const sendContactMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, subject, message } = req.body;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        // 📩 Mail to me
        const adminMail = {
            from: email,
            to: process.env.EMAIL,
            subject: `Portfolio Contact: ${subject}`,
            html: contactEmailTemplate({
                name,
                email,
                subject,
                message
            })
        };

        // 📩 Auto reply to client
        const clientMail = {
            from: process.env.EMAIL,
            to: email,
            subject: "Thanks for contacting me",
            html: clientReplyTemplate({
                name,
                message
            })
        };

        await transporter.sendMail(adminMail);
        await transporter.sendMail(clientMail);

        res.status(200).json({
            message: "Message sent successfully"
        });

    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};
