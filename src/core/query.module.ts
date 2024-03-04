import { Module } from '@nestjs/common'
import { QueryExtractorService } from './application/query-extractor.service'
import { QueryORMAdapter } from './application/query.adapter'

@Module({
  providers: [QueryExtractorService, QueryORMAdapter],
  exports: [QueryExtractorService, QueryORMAdapter],
})
export class QueryModule {}
