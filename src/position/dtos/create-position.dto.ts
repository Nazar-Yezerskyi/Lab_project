import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  position: string;

  @IsNumber()
  salary: number;

  @IsDateString()
  dateOfEmploy: string;
}
