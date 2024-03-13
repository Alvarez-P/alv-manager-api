import { Module } from '@nestjs/common'
import { CryptoService } from './application/crypto.service'
import { FileManagerService } from './application/file-manager.service'

@Module({
  providers: [CryptoService, FileManagerService],
  exports: [CryptoService, FileManagerService],
})
export class ToolsModule {}
