import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { mkdir, access, rename, rm, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import { writeFile } from 'fs/promises'
import { glob } from 'glob'
import * as sharp from 'sharp'

@Injectable()
export class FileManagerService {
  constructor() {}

  async createDirectory(path: string) {
    try {
      const accessed = await access(path).catch(() => false)
      if (!accessed) return mkdir(path, { recursive: true })
      return true
    } catch (error: unknown) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  async pathExists(path: string) {
    try {
      if (existsSync(path)) return true
      return false
    } catch (error: unknown) {
      return false
    }
  }

  async moveFile(from: string, to: string) {
    try {
      if (this.pathExists(from)) await rename(from, to)
      return true
    } catch (error: unknown) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  async saveFile(filePath: string, buffer: Buffer) {
    try {
      await writeFile(filePath, buffer)
    } catch (error: unknown) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  async removeFile(path: string) {
    try {
      const accessed = existsSync(path)
      if (accessed) await unlink(path)
    } catch (error: unknown) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  async clearDir(path: string) {
    try {
      const files = await glob(path, {
        ignore: [
          'node_modules/**',
          'src/**',
          'dist/**',
          'public/**',
          '.git/**',
          '.husky/**',
          '.next/**',
          '.vscode/**',
        ],
      })
      await Promise.all(
        files.map((file) => rm(file, { recursive: true, force: true })),
      )
    } catch (error: unknown) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  getFileCoincidence(path: string) {
    try {
      return glob(path, {
        ignore: [
          'node_modules/**',
          'src/**',
          'dist/**',
          'public/**',
          '.git/**',
          '.next/**',
          '.husky/**',
        ],
      })
    } catch (error: unknown) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  minifyImage({
    inputFile,
    maxWidth = 800,
    maxHeight = undefined,
    outputDirectory = '.',
    outputFilename = new Date().getTime().toString(),
    quality = 80,
    toExtension = 'webp',
    toFile,
  }: {
    inputFile: string
    maxWidth?: number
    maxHeight?: number
    quality?: number
    outputDirectory?: string
    outputFilename?: string
    toExtension?: 'webp' | 'jpg' | 'png' | 'jpeg'
    toFile?: boolean
  }) {
    const extensionResolverMap = {
      webp: 'webp',
      jpg: 'jpg',
      png: 'png',
      jpeg: 'jpeg',
    }
    const builder = sharp(inputFile)
      .resize(maxWidth, maxHeight, {
        fit: 'cover',
        withoutEnlargement: true,
      })
      [extensionResolverMap[toExtension]]({ quality })
    if (toFile)
      return builder.toFile(
        `${outputDirectory}/${outputFilename}.${toExtension}`,
      )
    return builder.toBuffer()
  }
}
