import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { json, urlencoded } from 'body-parser';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Configurar CORS (permite acceso solo a dominios específicos en producción)
    app.enableCors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || '*', // Mejor seguridad en producción
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true,
    });

    // Seguridad con Helmet
    app.use(helmet());
    app.use(helmet.hidePoweredBy()); // Oculta "X-Powered-By" (mejor seguridad)

    // Middleware para cookies y JSON
    app.use(cookieParser());
    app.use(json({ limit: '10mb' }));
    app.use(urlencoded({ extended: true, limit: '10mb' }));

    // Aplicar prefijo global (Ej: "api")
    const globalPrefix = process.env.API_PREFIX || 'api';
    app.setGlobalPrefix(globalPrefix);

    // Habilitar validaciones globales para DTOs
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    // Validar variables de entorno críticas antes de levantar el servidor
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      Logger.warn('⚠️ MercadoPago Token no configurado. Es posible que los pagos no funcionen.', 'Bootstrap');
    }
    if (!process.env.DATABASE_URL) {
      Logger.warn('⚠️ No se ha configurado la conexión a la base de datos.', 'Bootstrap');
    }

    // Obtener rutas registradas en NestJS (corregido para versiones nuevas)
    try {
      const routes = app.getHttpServer()._events.request._router.stack
        .filter((layer: any) => layer.route)
        .map((layer: any) => `${Object.keys(layer.route.methods)[0].toUpperCase()} ${layer.route.path}`);

      Logger.log(`📌 Rutas disponibles:\n${routes.join('\n')}`, 'Bootstrap');
    } catch (routeError) {
      Logger.warn('⚠️ No se pudieron cargar las rutas disponibles.', 'Bootstrap');
    }

    // Levantar el servidor
    const port = process.env.PORT || 3000;
    await app.listen(port);

    Logger.log(`🚀 Servidor corriendo en: http://localhost:${port}/${globalPrefix}`, 'Bootstrap');
    Logger.log(`🔧 Modo: ${process.env.NODE_ENV || 'development'}`, 'Bootstrap');
    Logger.log(`🎯 API URL: ${process.env.API_URL || 'http://localhost:3000'}`, 'Bootstrap');

  } catch (error: any) {
    Logger.error('❌ Error al iniciar el servidor', 'Bootstrap');

    if (error?.message) {
      Logger.error(`Mensaje: ${error.message}`, 'Bootstrap');
      Logger.error(`Stack: ${error.stack || 'No disponible'}`, 'Bootstrap');
    } else {
      Logger.error(`Error desconocido: ${JSON.stringify(error)}`, 'Bootstrap');
    }

    process.exit(1);
  }
}

bootstrap();
