import { IsArray, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class AddRoomPhotosDto {
  @IsInt()
  @Min(1)
  roomIdroom: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  photos: string[];
}
