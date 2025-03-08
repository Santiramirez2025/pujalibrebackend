import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  async register(createUserDto: CreateUserDto) {
    return { message: 'Usuario registrado correctamente', user: createUserDto };
  }
}
