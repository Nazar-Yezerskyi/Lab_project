import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class AuthUserSignInDto{
    @IsString()
    email: string;
    @IsString()
    password_typed: string
}