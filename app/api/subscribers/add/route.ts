import { NextResponse } from 'next/server';
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
        const { nombre, email } = await request.json();

        // Validar que tengamos todos los datos necesarios
        if (!nombre || !email) {
            return NextResponse.json(
                { success: false, error: 'Nombre y email son requeridos' },
                { status: 400 }
            );
        }

        // Validar formato de email básico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Formato de email inválido' },
                { status: 400 }
            );
        }

        // Conectar a la base de datos
        connection = await mysql.createConnection(dbConfig);

        // Verificar si el email ya existe
        const [existingEmails] = await connection.execute(
            'SELECT Email FROM subscriptors WHERE Email = ?',
            [email]
        );

        if (Array.isArray(existingEmails) && (existingEmails as any[]).length > 0) {
            return NextResponse.json(
                { success: false, error: 'El email ya está registrado' },
                { status: 409 }
            );
        }

        // Insertar nuevo suscriptor
        await connection.execute(
            'INSERT INTO subscriptors (Fecha_Alta, Nombre, Email, Status) VALUES (NOW(), ?, ?, "Active")',
            [nombre, email]
        );

        return NextResponse.json({
            success: true,
            message: 'Suscriptor añadido correctamente'
        });

    } catch (error) {
        console.error('Error al añadir suscriptor:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Error al añadir el suscriptor',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    } finally {
        // Cerrar la conexión si está abierta
        if (connection) {
            await connection.end();
        }
    }
} 