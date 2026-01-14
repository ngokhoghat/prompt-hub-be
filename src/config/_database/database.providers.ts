import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseProviders = {
  provide: 'DATABASE_CONNECTION',
  useFactory: (): TypeOrmModuleOptions => {
    const entities = [__dirname + '/../../**/*.entity{.ts,.js}'];
    
    return {
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: entities,
      synchronize: true,
      // dropSchema: true
    };
  },
};
