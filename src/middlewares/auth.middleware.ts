import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, next: NextFunction) {
    // ✅ Definir rutas que no requieren autenticación
    const publicRoutes = [
      '/api/auctions/active',
      '/api/auctions/:id',
      '/',
    ];

    // ✅ Permitir acceso libre a rutas públicas
    if (publicRoutes.includes(req.path)) {
      return next();
    }

    // 🚨 Verificar si la solicitud tiene token de autenticación
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No autorizado. Token no encontrado.');
    }

    const token = authHeader.split(' ')[1];

    try {
      // 🔐 Verificar el token con Firebase
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;  // ✅ Ahora `req.user` está definido
      next();
    } catch (error) {
      throw new UnauthorizedException('Token inválido.');
    }
  }
}
