import { TypeOrmModule } from '@nestjs/typeorm';

export const DatabaseConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'pujalibre',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
});
