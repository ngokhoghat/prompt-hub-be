import { Module, ValidationError, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './_guards/auth.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { UploadModule } from './upload/upload.module';
import { PermissionsGuard } from './_guards/permissions.guard';
import { DatabaseModule } from 'src/config/_database/database.module';

import { ValidationFilter } from 'src/config/_exception-handler/ValidationFilter';
import { GlobalHttpExceptionFilter } from 'src/config/_exception-handler/GlobalHttpExceptionFilter';
import { BadRequestExceptionFilter } from 'src/config/_exception-handler/BadRequestExceptionFilter';
import { TransformResponseInterceptor } from 'src/config/_interceptor/TransformResponse';
import { ValidationException } from 'src/config/_exception-handler/ValidationException';
import { FileStorageModule } from './file-storage/file-storage.module';
import { PromptModule } from './prompt/prompt.module';
import { AIModelModule } from './ai-model/ai-model.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { PromptInteractionModule } from './prompt-interaction/prompt-interaction.module';
import { TrendingModule } from './trending/trending.module';

@Module({
  providers: [
    // { provide: APP_GUARD, useClass: AuthGuard },
    // { provide: APP_GUARD, useClass: PermissionsGuard },
    { provide: APP_FILTER, useClass: ValidationFilter },
    { provide: APP_FILTER, useClass: GlobalHttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor },
    {
      provide: APP_PIPE, useFactory: () => new ValidationPipe({
        exceptionFactory: (errors: ValidationError[]) => new ValidationException(errors)
      })
    },
    { provide: APP_FILTER, useClass: BadRequestExceptionFilter },
  ],
  imports: [
    DatabaseModule,
    ScheduleModule.forRoot(),
    FileStorageModule,
    UploadModule,
    AuthModule,
    PromptModule,
    AIModelModule,
    CategoryModule,
    TagModule,
    PromptInteractionModule,
    TrendingModule
  ],
})
export class AppModule { }
