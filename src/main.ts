import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ZodValidationPipe, patchNestJsSwagger } from 'nestjs-zod'
import helmet from 'helmet'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { EnvService } from './core/application/env.service'
import { Logger } from '@nestjs/common'

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

  const envService = app.get(EnvService)
  const SERVER_PORT = envService.get('SERVER_PORT')
  await app.listen(SERVER_PORT, () => {
    Logger.log(`Server running on port ${SERVER_PORT}`)
  })
}
bootstrap()
