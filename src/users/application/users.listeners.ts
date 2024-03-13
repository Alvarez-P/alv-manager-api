import { Inject, Injectable } from '@nestjs/common'
import { UserRepository } from '../infrastructure/user.repository'
import {
  USER_UPDATED_PROFILE_PICTURE_EVENT,
  USER_PROVIDER_TOKENS,
  getUserFilesPath,
  USER_FILE_NAMES,
} from '../constants'
import { FileManagerService } from 'src/core/application/file-manager.service'
import { OnEvent } from '@nestjs/event-emitter'
import { User } from '../domain/user.entity'
import { join } from 'path'

@Injectable()
export class UserEventListeners {
  constructor(
    @Inject(USER_PROVIDER_TOKENS.REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly fileManagerService: FileManagerService,
  ) {}

  @OnEvent(USER_UPDATED_PROFILE_PICTURE_EVENT, { async: true })
  async handleUserUpdatedProfilePictureEvent(payload: User) {
    const { profilePicture } = payload
    if (!profilePicture || !this.fileManagerService.pathExists(profilePicture))
      return null
    const outputDirectory = getUserFilesPath(payload.id)
    const outputFilename = USER_FILE_NAMES.PROFILE_PICTURE
    const toExtension = 'webp'
    const resizedInfo = await this.fileManagerService.minifyImage({
      inputFile: profilePicture,
      toExtension,
      outputFilename,
      outputDirectory,
      toFile: false,
    })
    const newFilePath = join(
      outputDirectory,
      `${outputFilename}.${toExtension}`,
    )
    return Promise.all([
      this.fileManagerService.saveFile(newFilePath, resizedInfo),
      this.fileManagerService.removeFile(profilePicture),
      this.userRepository.updateOne(payload.id, {
        profilePicture: newFilePath,
      }),
    ])
  }
}
