import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UsersModule } from './users/users.module'
import { DbModule } from './core/db.module'
import { UnitOfWorkModule } from './core/uow.module'
import { ToolsModule } from './core/tools.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ThrottlerModule } from '@nestjs/throttler'
import { QueryModule } from './core/query.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    DbModule,
    UnitOfWorkModule,
    UsersModule,
    ToolsModule,
    QueryModule,
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  public static SERVER_PORT: number
  constructor(private readonly configService: ConfigService) {
    AppModule.SERVER_PORT = this.configService.get<number>('SERVER_PORT')
  }
}
