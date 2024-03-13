import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  HttpException,
  StreamableFile,
  Res,
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
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor'
import { UserIdInputDto } from '../domain/dto/user-id-input.dto'
import type { Response } from 'express'

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
    @Param() { id }: UserIdInputDto,
  ): Promise<ItemOutputDto<UserOutputDto>> {
    return this.usersService.findById(id)
  }

  @Put(':id')
  async updateOne(
    @Param() { id }: UserIdInputDto,
    @Body() updateUserDto: UpdateUserInputDto,
  ): Promise<GenericOutputDto<UserOutputDto>> {
    const data = await this.usersService.updateOne(id, updateUserDto, '')
    return { message: 'Usuario actualizado correctamente.', data }
  }

  @Delete(':id')
  async deleteOne(
    @Param() { id }: UserIdInputDto,
  ): Promise<GenericOutputDto<UserOutputDto>> {
    await this.usersService.deleteOne(id, '')
    return { message: 'Usuario eliminado correctamente.' }
  }

  @Patch(':id/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePic(
    @Param() { id }: UserIdInputDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|webp)$/i })
        .addMaxSizeValidator({ maxSize: 100000 })
        .build({
          exceptionFactory() {
            throw new HttpException(
              'El archivo es demasiado grande o no es una imagen.',
              HttpStatus.BAD_REQUEST,
            )
          },
        }),
    )
    file: Express.Multer.File,
  ): Promise<GenericOutputDto<UserOutputDto>> {
    const data = await this.usersService.uploadProfilePic(id, file)
    return { message: 'Imagen de perfil actualizada correctamente.', data }
  }

  @Get(':id/profile-picture')
  async getProfilePic(
    @Param() { id }: UserIdInputDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile | null> {
    const data = await this.usersService.getProfilePic(id)
    if (!data) return null
    res.set({ 'Content-Type': `image/${data.extension}` })
    return data.file
  }

  // TODO: implement
  @Patch(':id/password')
  changePwd(@Param() { id }: UserIdInputDto) {
    return this.usersService.findById(id)
  }
  @Patch(':id/password/callback')
  changePwdCb(@Param() { id }: UserIdInputDto) {
    return this.usersService.findById(id)
  }
  @Patch(':id/enable')
  enableUser(@Param() { id }: UserIdInputDto) {
    return this.usersService.findById(id)
  }
  @Patch(':id/disable')
  disableUser(@Param() { id }: UserIdInputDto) {
    return this.usersService.findById(id)
  }
}
