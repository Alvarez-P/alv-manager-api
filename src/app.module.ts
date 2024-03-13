import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module'
import { DbModule } from './core/db.module'
import { UnitOfWorkModule } from './core/uow.module'
import { ToolsModule } from './core/tools.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { QueryModule } from './core/query.module'
import { MulterModule } from '@nestjs/platform-express'
import { TEMP_FILES_FOLDER } from './core/constants'
import { EnvModule } from './core/env.module'
import { ConfigEnvSchema } from './core/domain/types/env.interface'
import { EventEmitterModule } from '@nestjs/event-emitter'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => ConfigEnvSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    DbModule,
    UnitOfWorkModule,
    UsersModule,
    ToolsModule,
    QueryModule,
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    MulterModule.register({ dest: TEMP_FILES_FOLDER }),
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {}
}
