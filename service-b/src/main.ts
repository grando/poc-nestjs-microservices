import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // enable global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    // add custom filter for validation exceptions
    app.useGlobalFilters(new ValidationExceptionFilter());
  
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
