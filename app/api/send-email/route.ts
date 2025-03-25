import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import mysql from 'mysql2/promise';

// Configuración para indicar que esta ruta es dinámica
export const dynamic = 'force-dynamic';

// Configuración de la conexión a la base de datos
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

        // Validar que tengamos todos los datos necesarios
        if (!html || !subject || !recipients || !recipients.length) {
            return NextResponse.json(
                { error: 'Faltan datos requeridos (html, subject, recipients)' },
                { status: 400 }
            );
        }

        // Configurar el transporter de nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'rogelio.carata10@gmail.com',
                pass: 'aamf ixhe hbnh dyis'
            }
        });

        // Opciones del email
        const mailOptions = {
            from: 'Newsletter <rogelio.carata10@gmail.com>',
            to: recipients.join(', '),
            subject: subject,
            html: html
        };

        // Enviar el email
        const info = await transporter.sendMail(mailOptions);

        // Conectar a la base de datos para registrar el envío
        connection = await mysql.createConnection(dbConfig);

        // Registrar el envío de newsletter en la base de datos (aquí podrías crear una tabla para historial)
        // Este es un ejemplo, idealmente tendrías una tabla de envíos de newsletter
        const newsletterLog = {
            date_sent: new Date(),
            subject: subject,
            recipients_count: recipients.length,
            message_id: info.messageId
        };

        console.log('Email enviado con éxito:', newsletterLog);

        return NextResponse.json({
            success: true,
            messageId: info.messageId,
            message: `Email enviado con éxito a ${recipients.length} suscriptor(es)`
        });

    } catch (error) {
        console.error('Error al enviar el email:', error);
        return NextResponse.json(
            { error: 'Error al enviar el email', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    } finally {
        // Cerrar la conexión si está abierta
        if (connection) {
            await connection.end();
        }
    }
} 