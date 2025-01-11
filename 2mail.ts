import nodemailer from "nodemailer";

export class EmailSender {
    private transporter;

    constructor(email: string, password: string) {
        this.transporter = nodemailer.createTransport({
            host: "smtp.office365.com", // Microsoft Exchange SMTP server
            port: 587, // Port for TLS
            secure: false, // Use TLS
            auth: {
                user: email,
                pass: password,
            },
        });
    }

    /**
     * Sends an email with an attachment.
     * @param to Recipient email address.
     * @param subject Email subject.
     * @param text Email body text.
     * @param filePath Path to the file attachment.
     */
    async sendEmail(to: string, subject: string, text: string, filePath?: string) {
        const mailOptions: nodemailer.SendMailOptions = {
            from: `"Local App" <${this.transporter.options.auth?.user}>`,
            to,
            subject,
            text,
            ...(filePath && {
                attachments: [
                    {
                        path: filePath, // Path to the file to attach
                    },
                ],
            }),
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Email sent: ", info.response);
        } catch (error) {
            console.error("Error sending email: ", error);
        }
    }
}


import { writeFileSync } from "fs";

export class FileHandler {
    /**
     * Writes data to a JSON file.
     * @param filePath Path to the output file.
     * @param data Data to write.
     */
    static writeToFile(filePath: string, data: Record<string, any>) {
        writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
        console.log(`Data written to file: ${filePath}`);
    }
}


import { test, expect } from "@playwright/test";
import { EmailSender } from "./EmailSender";
import { FileHandler } from "./FileHandler";

const testData: Record<string, any> = {};

test("UI Test", async ({ page }) => {
    const email = "your-email@example.com"; // Your MS Office Exchange email
    const password = "your-password"; // Your email password (or app password)
    const filePath = "test-results.json";

    // Step 1: Execute Test and Collect Data
    testData["step1"] = "Navigated to homepage";
    await page.goto("https://example.com");

    const title = await page.title();
    expect(title).toBe("Example Domain");
    testData["step2"] = `Verified title: ${title}`;

    // Step 2: Write Data to File
    FileHandler.writeToFile(filePath, testData);

    // Step 3: Send Email with Attachment
    const emailSender = new EmailSender(email, password);
    await emailSender.sendEmail(
        "recipient@example.com",
        "Test Results",
        "Please find the attached test results.",
        filePath
    );
});
