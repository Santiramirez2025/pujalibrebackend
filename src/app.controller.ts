import { Controller, Get } from '@nestjs/common';

@Controller()  // Prefijo para todas las rutas en este controlador
export class AppController {

  @Get('/status')
getStatus() {
  return { message: "API funcionando correctamente" };
}

  @Get()  // Responde en '/api'
  getHello() {
    return { message: '🚀 Servidor funcionando correctamente' };
  }
}
