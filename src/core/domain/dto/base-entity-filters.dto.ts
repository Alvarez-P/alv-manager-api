import { IsOptional, IsNumber, ValidateIf } from 'class-validator'

export class NumberEntityFilterDto {
  @IsOptional()
  @IsNumber()
  @ValidateIf((o) => o.$not !== undefined || o.$gt !== null)
  $not?: number | null

  @IsOptional()
  @IsNumber()
  @ValidateIf((o) => o.$gt !== undefined)
  $gte?: number

  @IsOptional()
  @IsNumber()
  @ValidateIf((o) => o.$gt !== undefined && o.$gte !== undefined)
  $lte?: number
}
