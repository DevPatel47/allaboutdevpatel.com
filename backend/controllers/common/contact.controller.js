import nodemailer from 'nodemailer';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

// Try different SMTP configurations
const createTransporter = () => {
    // Try Gmail with different port configurations
    const configs = [
        {
            name: 'Gmail Port 587 (TLS)',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        },
        {
            name: 'Gmail Port 465 (SSL)',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        },
        {
            name: 'Gmail Port 25 (Legacy)',
            host: 'smtp.gmail.com',
            port: 25,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        },
    ];

    return configs.map((config) => ({
        ...config,
        transporter: nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: config.auth,
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
            debug: true,
            logger: true,
        }),
    }));
};

export const sendContactMessage = asyncHandler(async (req, res) => {
    console.log('Contact form submission:', req.body);
    const { name, email, subject, message } = req.body || {};

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
        throw new ApiError(400, 'All fields are required');
    }

    const mailOptions = {
        from: `"${name} via Portfolio" <${process.env.EMAIL_USER}>`,
        to: process.env.CONTACT_TO || process.env.EMAIL_USER,
        replyTo: email,
        subject: `[Portfolio Contact] ${subject}`,
        text: `From: ${name} <${email}>\n\nMessage:\n${message}`,
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br/>')}</p>
            <hr>
            <p><em>Sent from Portfolio Contact Form</em></p>
        `,
    };

    const transporters = createTransporter();
    let emailSent = false;
    let result;

    // Try each SMTP configuration
    for (const config of transporters) {
        try {
            console.log(`Trying ${config.name}...`);

            // Test connection
            const verifyPromise = config.transporter.verify();
            const verifyTimeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Connection timeout')), 8000),
            );

            await Promise.race([verifyPromise, verifyTimeout]);
            console.log(`${config.name} connection verified`);

            // Send email
            const emailPromise = config.transporter.sendMail(mailOptions);
            const emailTimeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Send timeout')), 10000),
            );

            result = await Promise.race([emailPromise, emailTimeout]);
            emailSent = true;
            console.log(`Email sent successfully via ${config.name}:`, result.messageId);
            config.transporter.close();
            break;
        } catch (error) {
            console.log(`${config.name} failed:`, error.message);
            config.transporter.close();
            continue;
        }
    }

    if (emailSent) {
        return res.status(200).json(
            new ApiResponse(200, 'Message sent successfully', {
                ok: true,
                messageId: result.messageId,
            }),
        );
    } else {
        // If all SMTP methods fail, log the submission
        console.log('=== ALL SMTP METHODS FAILED - LOGGING SUBMISSION ===');
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Subject: ${subject}`);
        console.log(`Message: ${message}`);
        console.log(`Timestamp: ${new Date().toISOString()}`);
        console.log('===============================================');

        // Check if ports are blocked by testing connectivity
        console.log('Testing port connectivity...');

        throw new ApiError(
            503,
            'Email service temporarily unavailable. Your message has been logged and we will contact you soon.',
        );
    }
});
