import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ConfigEnv } from '../domain/types/env.interface'

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<ConfigEnv, true>) {}

  get<T extends keyof ConfigEnv>(key: T) {
    return this.configService.get(key, { infer: true })
  }
}
