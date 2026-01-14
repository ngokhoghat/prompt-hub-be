import { join } from 'path';
import { Logger } from '@nestjs/common';
import { AppModule } from './modules/app.module';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DatabaseService } from './config/_database/database.service';

(async function bootstrap() {
  await new DatabaseService().createDatabase();
  const app = await NestFactory.create<NestApplication>(AppModule);
  const logger = new Logger('bootstrap');
  app.setGlobalPrefix('api-fs');
  app.enableCors({ origin: true, credentials: true });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(process.env.PORT || 8889, '0.0.0.0');
  logger.log(`Server is running at ${await app.getUrl()}`);
})();