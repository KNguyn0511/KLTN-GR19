import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { configureUploads } from './configure-uploads';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // --- SỬA LẠI ĐOẠN NÀY ---
  app.enableCors({
    // Cho phép cả link Vercel và các link chạy dưới máy local (3000)
    origin: [
      'https://net-tech-six.vercel.app', 
      'http://localhost:3000', 
      'http://127.0.0.1:3000'
    ], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // -----------------------

  configureUploads(app);

  const config = new DocumentBuilder()
    .setTitle('NetTech API')
    .setDescription('Tài liệu API cho dự án đồ án nhóm 19')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Lắng nghe trên 0.0.0.0 để các dịch vụ khác (như AI route) dễ dàng tìm thấy
  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 NetTech Backend đang chạy tại: http://localhost:${port}`);
  console.log(`📖 Tài liệu Swagger: http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => console.error(err));