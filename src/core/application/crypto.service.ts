import { Injectable } from '@nestjs/common'
import { scryptSync, randomUUID } from 'crypto'
import { EnvService } from './env.service'

@Injectable()
export class CryptoService {
  private pwd: string
  constructor(private readonly envService: EnvService) {
    this.pwd = this.envService.get('SERVER_CRYPTO_PWD')
  }
  generateUUID() {
    return randomUUID()
  }
  encrypt(text: string, salt: string) {
    return scryptSync(text, salt, 32).toString('hex')
  }
  hash(text: string): string {
    const salt = Buffer.from(this.pwd).toString('hex')
    return this.encrypt(text, salt) + salt
  }
  matchHash(text: string, hash: string): boolean {
    const salt = hash.slice(64)
    const originalPassHash = hash.slice(0, 64)
    const currentPassHash = this.encrypt(text, salt)
    return originalPassHash === currentPassHash
  }
}
