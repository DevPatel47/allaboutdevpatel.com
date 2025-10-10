import nodemailer from 'nodemailer';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
});

export const sendContactMessage = asyncHandler(async (req, res) => {
    console.log('Contact form submission:', req.body);
    const { name, email, subject, message } = req.body || {};
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
        throw new ApiError(400, 'All fields are required');
    }

    try {
        console.log('Attempting to send email...');

        // Add timeout wrapper
        const emailPromise = transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.CONTACT_TO || process.env.EMAIL_USER,
            replyTo: email,
            subject: `[Portfolio] ${subject}`,
            text: `From: ${name} <${email}>\n\n${message}`,
            html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(
                /\n/g,
                '<br/>',
            )}</p>`,
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Email timeout')), 25000),
        );

        const result = await Promise.race([emailPromise, timeoutPromise]);
        console.log('Email sent successfully:', result.messageId);

        return res.status(200).json(new ApiResponse(200, 'Message sent', { ok: true }));
    } catch (error) {
        console.error('Email sending failed:', error.message);

        if (error.message.includes('timeout') || error.message.includes('Connection timeout')) {
            throw new ApiError(
                503,
                'Email service temporarily unavailable. Please try again later.',
            );
        }

        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            throw new ApiError(503, 'Cannot connect to email service. Please try again later.');
        }

        throw new ApiError(500, 'Failed to send message. Please try again.');
    }
});
