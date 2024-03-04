import { Inject, Injectable } from '@nestjs/common'
import { CreateUserInputDto } from '../domain/dto/create-user-input.dto'
import { UpdateUserInputDto } from '../domain/dto/update-user-input.dto'
import { USER_PROVIDER_TOKENS } from '../constants'
import { UserRepository } from '../infrastructure/user.repository'
import { CryptoService } from 'src/core/application/crypto.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ENTITY_ACTIONS, ENTITY_NAMES } from 'src/core/constants'
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

const USER_CREATED_EVENT = `${ENTITY_NAMES.USERS}.${ENTITY_ACTIONS.CREATED}`
const USER_UPDATED_EVENT = `${ENTITY_NAMES.USERS}.${ENTITY_ACTIONS.UPDATED}`
const USER_DELETED_EVENT = `${ENTITY_NAMES.USERS}.${ENTITY_ACTIONS.DELETED}`

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_PROVIDER_TOKENS.REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
    private readonly eventEmitter: EventEmitter2,
    private readonly queryAdapter: QueryORMAdapter<User>,
    private readonly queryExtractorService: QueryExtractorService<User>,
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
    const newUser = {
      ...createUserDto,
      password: hashedPwd,
      createdBy,
    }
    const saved = await this.userRepository.save(newUser)
    this.eventEmitter.emit(USER_CREATED_EVENT, { data: saved })
    return plainToInstance(UserOutputDto, saved)
  }

  async findAll(
    userQueryInputDto: UserQueryInputDto,
  ): Promise<ItemListOutputDto<UserOutputDto>> {
    const { pagination, order, ...filters } =
      this.queryExtractorService.extract(userQueryInputDto as any)
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
    this.eventEmitter.emit(USER_UPDATED_EVENT, { data: updated })
    return plainToInstance(UserOutputDto, updated)
  }

  async deleteOne(id: string, deletedBy: string) {
    await this.userRepository.updateOne(id, { isActive: false })
    await this.userRepository.deleteOne(id, deletedBy)
    this.eventEmitter.emit(USER_DELETED_EVENT, { data: id })
  }
}
