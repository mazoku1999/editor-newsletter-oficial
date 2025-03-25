import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import mysql from 'mysql2/promise';

// Configuration to indicate that this route is dynamic
export const dynamic = 'force-dynamic';

// Database connection configuration
const dbConfig = {
    host: '132.148.179.230',
    user: 'msp',
    password: 'Viva1Bolivia?',
    database: 'HI'
};

export async function POST(request: Request) {
    let connection;

    try {
        const { html, subject, recipients } = await request.json();

        // Validate that we have all the necessary data
        if (!html || !subject || !recipients || !recipients.length) {
            return NextResponse.json(
                { error: 'Missing required data (html, subject, recipients)' },
                { status: 400 }
            );
        }

        // Configure the nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'motionsoundproduction2024@gmail.com',
                pass: 'dmim evvz ftbu mmkq'
            }
        });

        // Email options
        const mailOptions = {
            from: 'Newsletter <motionsoundproduction2024@gmail.com>',
            to: recipients.join(', '),
            subject: subject,
            html: html
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        // Connect to the database to record the sending
        connection = await mysql.createConnection(dbConfig);

        // Record the newsletter sending in the database (you could create a table for history)
        // This is an example, ideally you would have a newsletter sending table
        const newsletterLog = {
            date_sent: new Date(),
            subject: subject,
            recipients_count: recipients.length,
            message_id: info.messageId
        };

        console.log('Email sent successfully:', newsletterLog);

        return NextResponse.json({
            success: true,
            messageId: info.messageId,
            message: `Email successfully sent to ${recipients.length} subscriber(s)`
        });

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Error sending email', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    } finally {
        // Close the connection if it's open
        if (connection) {
            await connection.end();
        }
    }
} 