import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ZodValidationPipe, patchNestJsSwagger } from 'nestjs-zod'
import helmet from 'helmet'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(helmet())
  app.enableCors()
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ZodValidationPipe())

  const config = new DocumentBuilder()
    .setTitle('ALV Manager API')
    .setDescription('API Documentation.')
    .setVersion('1.0')
    .build()
  patchNestJsSwagger()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/doc', app, document)

  await app.listen(AppModule.SERVER_PORT)
}
bootstrap()
