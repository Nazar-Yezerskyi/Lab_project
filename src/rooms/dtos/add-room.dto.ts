import { IsInt, IsPositive, IsString, IsNumber, MaxLength } from 'class-validator';

export class CreateRoomDto {
  @IsInt()
  @IsPositive()
  roomNumber: number; 

  @IsString()
  @MaxLength(200)
  description: string

  @IsNumber()
  @IsPositive()
  pricePerDay: number; 

  @IsInt()
  @IsPositive()
  numberOfGuests: number; 
}
