import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuctionsModule } from './auctions/auctions.module';
import { AuthModule } from './auth/auth.module';  // ✅ Módulo de autenticación
import { AppController } from './app.controller';  // ✅ Controlador principal
import { AppService } from './app.service';  // ✅ Servicio principal
import { AuthMiddleware } from './middlewares/auth.middleware';

import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// ✅ Intentar obtener las credenciales de Firebase desde variable de entorno o archivo local
let serviceAccount: admin.ServiceAccount | null = null;

if (process.env.FIREBASE_CREDENTIALS) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
        console.log('✅ Firebase credentials cargadas desde variable de entorno.');
    } catch (error) {
        console.error('🚨 ERROR: Firebase credentials en variable de entorno no son válidas.');
        serviceAccount = null;
    }
} else {
    const serviceAccountPath = path.join(process.cwd(), 'config/firebase-admin.json');
    
    if (fs.existsSync(serviceAccountPath)) {
        try {
            serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

            // ✅ Corregir `private_key` si tiene caracteres escapados
            if (serviceAccount && typeof serviceAccount.privateKey === 'string') {
                serviceAccount.privateKey = serviceAccount.privateKey.replace(/\\n/g, '\n').trim();
            }

            console.log('✅ Firebase credentials cargadas desde archivo local.');
        } catch (error) {
            console.error('🚨 ERROR: No se pudo leer el archivo firebase-admin.json.');
            console.error(error instanceof Error ? error.message : error);
            serviceAccount = null;
        }
    } else {
        console.error('🔥 ERROR: Archivo firebase-admin.json no encontrado.');
    }
}

// ✅ Inicializar Firebase si hay credenciales disponibles
if (serviceAccount) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        console.log('✅ Firebase inicializado correctamente.');
    } catch (error) {
        console.error('🚨 ERROR: Falló la inicialización de Firebase.');
        console.error(error instanceof Error ? error.message : error);
    }
}

@Module({
    imports: [AuthModule, AuctionsModule],
    controllers: [AppController],  // ✅ Controlador principal
    providers: [AppService],  // ✅ Servicio principal
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        console.log('✅ Aplicando middleware de autenticación...');

        consumer.apply(AuthMiddleware)
            .forRoutes('*');  // ✅ Middleware aplicado a todas las rutas protegidas
    }
}
