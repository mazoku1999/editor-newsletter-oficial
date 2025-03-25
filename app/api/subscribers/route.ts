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

export async function GET() {
    let connection;

    try {
        // Crear conexión a la base de datos
        connection = await mysql.createConnection(dbConfig);

        // Ejecutar la consulta para obtener todos los suscriptores
        const [rows] = await connection.execute(
            'SELECT Id, Fecha_Alta, Nombre, Email, Status FROM subscriptors ORDER BY Nombre'
        );

        return NextResponse.json({
            success: true,
            subscribers: rows
        });

    } catch (error) {
        console.error('Error al obtener suscriptores:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Error al obtener los suscriptores',
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

// Endpoint para obtener solo suscriptores activos
export async function POST(request: Request) {
    let connection;

    try {
        // Obtener parámetros de filtro del cuerpo de la solicitud
        const { activeOnly = true } = await request.json();

        // Crear conexión a la base de datos
        connection = await mysql.createConnection(dbConfig);

        // Construir la consulta según si queremos solo activos o todos
        let query = 'SELECT Id, Fecha_Alta, Nombre, Email, Status FROM subscriptors';

        if (activeOnly) {
            query += " WHERE Status = 'Active'";
        }

        query += ' ORDER BY Nombre';

        // Ejecutar la consulta
        const [rows] = await connection.execute(query);

        return NextResponse.json({
            success: true,
            subscribers: rows
        });

    } catch (error) {
        console.error('Error al filtrar suscriptores:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Error al obtener los suscriptores',
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