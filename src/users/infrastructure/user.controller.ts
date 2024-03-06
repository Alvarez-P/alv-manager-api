import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common'
import { UsersService } from '../application/users.service'
import { CreateUserInputDto } from '../domain/dto/create-user-input.dto'
import { UpdateUserInputDto } from '../domain/dto/update-user-input.dto'
import { USER_PROVIDER_TOKENS } from '../constants'
import { UserQueryInputDto } from '../domain/dto/query-user-input.dto'
import { ApiExtraModels, ApiTags } from '@nestjs/swagger'
import { ENTITY_NAMES } from 'src/core/constants'
import {
  GenericOutputDto,
  ItemListOutputDto,
  ItemOutputDto,
} from 'src/core/domain/dto/base-response.dto'
import { UserOutputDto } from '../domain/dto/base-user-output.dto'

@ApiTags(ENTITY_NAMES.USERS)
@ApiExtraModels(UserQueryInputDto)
@Controller(ENTITY_NAMES.USERS)
export class UsersController {
  constructor(
    @Inject(USER_PROVIDER_TOKENS.SERVICE)
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserInputDto,
  ): Promise<GenericOutputDto<UserOutputDto>> {
    const data = await this.usersService.create(createUserDto, null)
    return { message: 'Usuario creado correctamente.', data }
  }

  @Get()
  findAll(
    @Query() userQueryInputDto: UserQueryInputDto,
  ): Promise<ItemListOutputDto<UserOutputDto>> {
    return this.usersService.findAll(userQueryInputDto)
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ItemOutputDto<UserOutputDto>> {
    return this.usersService.findById(id)
  }

  @Put(':id')
  async updateOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserInputDto,
  ): Promise<GenericOutputDto<UserOutputDto>> {
    const data = await this.usersService.updateOne(id, updateUserDto, '')
    return { message: 'Usuario actualizado correctamente.', data }
  }

  @Delete(':id')
  async deleteOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GenericOutputDto<UserOutputDto>> {
    await this.usersService.deleteOne(id, '')
    return { message: 'Usuario eliminado correctamente.' }
  }

  // TODO: implement
  @Patch(':id/password')
  changePwd(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id)
  }
  @Patch(':id/password/callback')
  changePwdCb(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id)
  }
  @Patch(':id/enable')
  enableUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id)
  }
  @Patch(':id/disable')
  disableUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id)
  }
}
