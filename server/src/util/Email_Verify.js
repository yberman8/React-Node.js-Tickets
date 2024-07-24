import dotenv from 'dotenv';
import axios from "axios";
import AuthModel from '../models/AuthModel.js';
import nodeMailer from 'nodemailer';
import TempCode from '../../config/models/tempCode.js';
dotenv.config();

class Token {
    constructor() {
    }

    static generateVerificationCode() {

        const codeLength = 6;
        let verificationCode = '';

        for (let i = 0; i < codeLength; i++) {
            verificationCode += Math.floor(Math.random() * 10); // Generate a random digit (0-9)
        }

        return verificationCode;
    }


    static async sendVerificationEmail(email, verificationCode) {

        let  details = {
            from: process.env.EMAIL_USER,  // Updated 'from' field
            to: email,
            subject: 'קליקול מערכת פניות - קוד אימות',
            html: `<div style="direction: rtl"><span>קוד האימות שלך הוא: </span><span style="font-weight: bold">${verificationCode}</span></div><div style="direction: rtl"><span>הקוד תקף ל5 דקות בלבד</span></div>`,
        };

        let transformMail = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            connectionTimeout: 6000,
        });



        try {
            const result = await Promise.race([
                transformMail.sendMail(details),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Email sending timed out")), 6000)
                ),
            ]);
            return { emailSent: true };
        } catch (error) {
            console.log("Error sending email" + error);
            return { emailSent: false };
        }

}


    static async validateEmailCode(userId, emailCode) {

    try {
        const savedCodes = await TempCode.find({user_id: userId});
        if (!savedCodes[0]) {
            return { isValid: false, message: "code not found" };
        }

        const hasCode = savedCodes.some(code => code.email_code_verify === emailCode);

        if (hasCode) {
            return { isValid: true, message: "code found" };
        } else {
            console.log("No codes with sms_code_verify equal to '123' were found.");
            return { isValid: false, message: "code not valid" };
        }

    } catch (error) {
        console.log(error);
        return { isValid: false, message: "error" };
    }
}
}

export default Token;
