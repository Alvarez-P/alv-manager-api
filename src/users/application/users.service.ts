import { Inject, Injectable, StreamableFile } from '@nestjs/common'
import { CreateUserInputDto } from '../domain/dto/create-user-input.dto'
import { UpdateUserInputDto } from '../domain/dto/update-user-input.dto'
import { UserRepository } from '../infrastructure/user.repository'
import { CryptoService } from 'src/core/application/crypto.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  EmailAlreadyUsedException,
  UserIsDisabledException,
  UserNotFoundException,
  UsernameAlreadyUsedException,
} from '../domain/user.exceptions'
import { UserQueryInputDto } from '../domain/dto/query-user-input.dto'
import { QueryORMAdapter } from 'src/core/application/query.adapter'
import { User } from '../domain/user.entity'
import { QueryExtractorService } from 'src/core/application/query-extractor.service'
import { plainToInstance } from 'class-transformer'
import { UserOutputDto } from '../domain/dto/base-user-output.dto'
import {
  ItemListOutputDto,
  ItemOutputDto,
} from 'src/core/domain/dto/base-response.dto'
import {
  USER_CREATED_EVENT,
  USER_DELETED_EVENT,
  USER_FILE_NAMES,
  USER_PROVIDER_TOKENS,
  USER_UPDATED_EVENT,
  USER_UPDATED_PROFILE_PICTURE_EVENT,
  getUserFilesPath,
} from '../constants'
import { FileManagerService } from 'src/core/application/file-manager.service'
import * as path from 'path'
import { createReadStream } from 'fs'

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_PROVIDER_TOKENS.REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
    private readonly eventEmitter: EventEmitter2,
    private readonly queryAdapter: QueryORMAdapter<User>,
    private readonly queryExtractorService: QueryExtractorService<User>,
    private readonly fileManagerService: FileManagerService,
  ) {}

  async create(
    createUserDto: CreateUserInputDto,
    createdBy: string | null,
  ): Promise<UserOutputDto> {
    const [emailIsUnique, usernameIsUnique] = await Promise.all([
      this.userRepository.isUnique({ target: { email: createUserDto.email } }),
      this.userRepository.isUnique({
        target: { username: createUserDto.username },
      }),
    ])
    if (!emailIsUnique) throw new EmailAlreadyUsedException()
    if (!usernameIsUnique) throw new UsernameAlreadyUsedException()
    const hashedPwd = this.cryptoService.hash(createUserDto.password)
    const newUser = { ...createUserDto, password: hashedPwd, createdBy }
    const saved = await this.userRepository.save(newUser)
    this.eventEmitter.emit(USER_CREATED_EVENT, { ...saved })
    return plainToInstance(UserOutputDto, saved)
  }

  async findAll(
    userQueryInputDto: UserQueryInputDto,
  ): Promise<ItemListOutputDto<UserOutputDto>> {
    const { pagination, order, filters } =
      this.queryExtractorService.extract(userQueryInputDto)
    const query = this.queryAdapter
      .addPagination(pagination.skip, pagination.take)
      .addOrderAndSort(order.orderBy, order.sortBy)
      .addWhere(filters)
      .buildQueryMany()
    const [users, total] = await this.userRepository.getAll(query)
    return {
      total,
      data: plainToInstance(UserOutputDto, users),
      skip: pagination.skip,
      take: pagination.take,
    }
  }

  async findById(id: string): Promise<ItemOutputDto<UserOutputDto>> {
    const user = await this.userRepository.getOne({ where: { id } })
    return { data: plainToInstance(UserOutputDto, user) }
  }

  async updateOne(
    id: string,
    updateUserDto: UpdateUserInputDto,
    updatedBy: string,
  ) {
    const [userExists, emailIsUnique, usernameIsUnique] = await Promise.all([
      this.userRepository.getOne({ where: { id } }),
      this.userRepository.isUnique({
        target: { email: updateUserDto.email },
        ignore: id,
      }),
      this.userRepository.isUnique({
        target: { username: updateUserDto.username },
        ignore: id,
      }),
    ])
    if (!userExists) throw new UserNotFoundException()
    if (!emailIsUnique) throw new EmailAlreadyUsedException()
    if (!usernameIsUnique) throw new UsernameAlreadyUsedException()
    if (!userExists.isActive) throw new UserIsDisabledException()
    const updateUser = { ...updateUserDto, updatedBy }
    const updated = await this.userRepository.updateOne(id, updateUser)
    this.eventEmitter.emit(USER_UPDATED_EVENT, { ...updated })
    return plainToInstance(UserOutputDto, updated)
  }

  async deleteOne(id: string, deletedBy: string) {
    await this.userRepository.updateOne(id, { isActive: false })
    await this.userRepository.deleteOne(id, deletedBy)
    this.eventEmitter.emit(USER_DELETED_EVENT, { id })
  }

  async uploadProfilePic(id: string, file: Express.Multer.File) {
    const user = await this.userRepository.getOne({ where: { id } })
    if (!user) throw new UserNotFoundException()
    if (
      user.profilePicture &&
      this.fileManagerService.pathExists(user.profilePicture)
    )
      await this.fileManagerService.removeFile(user.profilePicture)
    const fileExtension = file.originalname.split('.').pop()
    const userFilesPath = getUserFilesPath(id)
    const filepath = path.join(
      userFilesPath,
      `${USER_FILE_NAMES.PROFILE_PICTURE}.${fileExtension}`,
    )
    await this.fileManagerService.createDirectory(userFilesPath)
    await this.fileManagerService.saveFile(filepath, file.buffer)
    const updated = await this.userRepository.updateOne(id, {
      profilePicture: filepath,
    })
    this.eventEmitter.emit(USER_UPDATED_PROFILE_PICTURE_EVENT, updated)
    return plainToInstance(UserOutputDto, updated)
  }

  async getProfilePic(
    id: string,
  ): Promise<{ file: StreamableFile; extension: string } | null> {
    const user = await this.userRepository.getOne({ where: { id } })
    if (!user) throw new UserNotFoundException()
    if (
      !user.profilePicture ||
      !this.fileManagerService.pathExists(user.profilePicture)
    )
      return null
    return {
      file: new StreamableFile(createReadStream(user.profilePicture)),
      extension: user.profilePicture.split('.').pop(),
    }
  }
}
