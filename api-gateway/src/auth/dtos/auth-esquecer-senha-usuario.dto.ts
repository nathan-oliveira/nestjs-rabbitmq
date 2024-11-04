import { IsEmail } from "class-validator"

export class AuthEsquecerSenhaUsuarioDto {

    @IsEmail()
    email: string

}