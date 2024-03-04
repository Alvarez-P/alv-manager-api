import { Module } from '@nestjs/common'
import { UsersController } from './infrastructure/user.controller'
import { USER_PROVIDER_TOKENS } from './constants'
import { UsersService } from './application/users.service'
import { UserRepository } from './infrastructure/user.repository'
import { ToolsModule } from 'src/core/tools.module'
import { QueryModule } from 'src/core/query.module'
import { QueryORMAdapter } from 'src/core/application/query.adapter'
import { QueryExtractorService } from 'src/core/application/query-extractor.service'

@Module({
  imports: [ToolsModule, QueryModule],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_PROVIDER_TOKENS.REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: USER_PROVIDER_TOKENS.SERVICE,
      useClass: UsersService,
    },
    QueryORMAdapter,
    QueryExtractorService,
  ],
})
export class UsersModule {}
