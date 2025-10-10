import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const sendContactMessage = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body || {};

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
        throw new ApiError(400, 'All fields are required');
    }

    // Prepare Web3Forms data as URL-encoded form data
    const formData = new URLSearchParams();
    formData.append('access_key', process.env.WEB3FORMS_ACCESS_KEY);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('subject', `[Portfolio Contact] ${subject}`);
    formData.append('message', `From: ${name} <${email}>\n\nMessage:\n${message}`);
    formData.append('from_name', 'Portfolio Contact Form');
    formData.append('redirect', 'false'); // Don't redirect, return JSON

    try {
        // Send to Web3Forms API
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        // Check if response is ok first
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Web3Forms HTTP error:', response.status, errorText);
            throw new ApiError(response.status, `Failed to send message: HTTP ${response.status}`);
        }

        // Check content type before parsing JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await response.text();

            // If it contains success indicators, treat as success
            if (textResponse.includes('success') || textResponse.includes('sent')) {
                return res.status(200).json(
                    new ApiResponse(200, 'Message sent successfully', {
                        ok: true,
                    }),
                );
            }

            throw new ApiError(400, 'Unexpected response format from email service');
        }

        // Parse JSON response
        const result = await response.json();

        if (result.success) {
            return res.status(200).json(
                new ApiResponse(200, 'Message sent successfully', {
                    ok: true,
                }),
            );
        } else {
            throw new ApiError(400, result.message || 'Failed to send message');
        }
    } catch (error) {
        console.error('Web3Forms error:', error.message);

        // If it's our custom ApiError, re-throw it
        if (error instanceof ApiError) {
            throw error;
        }

        // For any other errors (like JSON parsing), throw a generic error
        throw new ApiError(500, 'Failed to send message due to service error');
    }
});
