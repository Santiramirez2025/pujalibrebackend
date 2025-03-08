import * as express from 'express';

declare module 'express' {
  export interface Request {
    user?: any;  // ✅ Agregar `user` para que TypeScript lo reconozca
  }
}
