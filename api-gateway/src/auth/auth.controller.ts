import { Controller, Body, Post, UsePipes, ValidationPipe, Get, Query, BadRequestException } from '@nestjs/common';
import { AuthRegistroUsuarioDto } from './dtos/auth-registro-usuario.dto'
import { AwsCognitoService } from '../aws/aws-cognito.service'
import { AuthLoginUsuarioDto } from './dtos/auth-login-usuario.dto'
import { AuthAlterarSenhaUsuarioDto } from './dtos/auth-alterar-senha-usuario.dto'
import { AuthConfirmarSenhaUsuarioDto } from './dtos/auth-confirmar-senha-usuario.dto';
import { AuthEsquecerSenhaUsuarioDto } from './dtos/auth-esquecer-senha-usuario.dto'

@Controller('api/v1/auth')
export class AuthController {

    constructor(
        private awsCognitoService: AwsCognitoService
    ) { }

    @Post('/registro')
    @UsePipes(ValidationPipe)
    async registro(
        @Body() authRegistroUsuarioDto: AuthRegistroUsuarioDto) {

        return await this.awsCognitoService.registrarUsuario(authRegistroUsuarioDto)
    }

    @Post('/login')
    @UsePipes(ValidationPipe)
    async login(
        @Body() authLoginUsuarioDto: AuthLoginUsuarioDto) {

        return await this.awsCognitoService.autenticarUsuario(authLoginUsuarioDto)

    }

    @Post('/alterarsenha')
    @UsePipes(ValidationPipe)
    async alterarSenha(
        @Body() authAlterarSenhaUsuarioDto: AuthAlterarSenhaUsuarioDto) {

        const resultado = await this.awsCognitoService.alterarSenhaUsuario(authAlterarSenhaUsuarioDto)

        if (resultado == 'SUCCESS') {

            return {
                status: 'sucesso'
            }

        }
    }

    @Post('/esquecersenha')
    @UsePipes(ValidationPipe)
    async esquecerSenha(
        @Body() authEsquecerSenhaUsuarioDto: AuthEsquecerSenhaUsuarioDto) {

        return await this.awsCognitoService.esquecerSenhaUsuario(authEsquecerSenhaUsuarioDto)

    }

    @Post('/confirmarsenha')
    @UsePipes(ValidationPipe)
    async confirmarSenha(
        @Body() authConfirmarSenhaUsuarioDto: AuthConfirmarSenhaUsuarioDto) {

        return await this.awsCognitoService.confirmarSenhaUsuario(authConfirmarSenhaUsuarioDto)

    }

    @Get('usuarios')
    async consultarUsuario(
        @Query('usuario') usuario: string
    ) {
        if (!usuario) {
            throw new BadRequestException('Parametro usuario deve ser informado!')
        }

        return await this.awsCognitoService.consultarUsuario(usuario)

    }

}
