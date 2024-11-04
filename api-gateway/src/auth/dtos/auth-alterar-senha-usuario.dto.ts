import { IsEmail, Matches } from "class-validator"

export class AuthAlterarSenhaUsuarioDto {

    @IsEmail()
    email: string

    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, { message: 'senha inválida' })
    senhaAtual: string

    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, { message: 'senha inválida' })
    novaSenha: string

}