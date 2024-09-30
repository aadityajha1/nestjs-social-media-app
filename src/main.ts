import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// Ignore the import error
// @ts-ignore
import { graphqlUploadExpress } from 'graphql-upload-ts';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'x-apollo-operation-name'],
  });

  await app.listen(3000);
}
bootstrap();
