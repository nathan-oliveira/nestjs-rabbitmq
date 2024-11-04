import { IsEmail, IsString, Matches } from "class-validator"

export class AuthConfirmarSenhaUsuarioDto {

    @IsEmail()
    email: string

    @IsString()
    codigoConfirmacao: string

    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, { message: 'senha inválida' })
    novaSenha: string

}