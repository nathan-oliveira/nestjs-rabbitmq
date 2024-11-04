import { Injectable } from "@nestjs/common";
import { AuthRegistroUsuarioDto } from '../auth/dtos/auth-registro-usuario.dto'
import { AuthLoginUsuarioDto } from '../auth/dtos/auth-login-usuario.dto'
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails
} from 'amazon-cognito-identity-js'
import { AwsCognitoConfig } from './aws-cognito.config'
import { AuthAlterarSenhaUsuarioDto } from '../auth/dtos/auth-alterar-senha-usuario.dto'
import { AuthConfirmarSenhaUsuarioDto } from '../auth/dtos/auth-confirmar-senha-usuario.dto'
import { AuthEsquecerSenhaUsuarioDto } from "src/auth/dtos/auth-esquecer-senha-usuario.dto";
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsCognitoService {

    //https://www.npmjs.com/package/amazon-cognito-identity-js    

    private userPool: CognitoUserPool

    constructor(
        private authConfig: AwsCognitoConfig
    ) {

        this.userPool = new CognitoUserPool({
            UserPoolId: this.authConfig.userPoolId,
            ClientId: this.authConfig.clientId
        })

    }

    async registrarUsuario(authRegistroUsuarioDto: AuthRegistroUsuarioDto) {

        const { nome, email, senha, telefoneCelular } = authRegistroUsuarioDto

        return new Promise((resolve, reject) => {
            this.userPool.signUp(
                email,
                senha,
                [
                    new CognitoUserAttribute({
                        Name: 'phone_number', Value: telefoneCelular
                    }),
                    new CognitoUserAttribute({
                        Name: 'name', Value: nome
                    })
                ], null,
                (err, result) => {
                    if (!result) {
                        reject(err)
                    } else {
                        resolve(result.user)
                    }
                }
            )
        })
    }

    async autenticarUsuario(authLoginUsuarioDto: AuthLoginUsuarioDto) {

        const { email, senha } = authLoginUsuarioDto

        const userData = {
            Username: email,
            Pool: this.userPool
        }

        const authenticationDetails = new AuthenticationDetails({
            Username: email,
            Password: senha
        })

        const userCognito = new CognitoUser(userData)

        return new Promise((resolve, reject) => {
            userCognito.authenticateUser(authenticationDetails, {

                onSuccess: (result) => {
                    resolve({
                        accessToken: result.getAccessToken().getJwtToken(),
                        refreshToken: result.getRefreshToken().getToken()
                    })
                },
                onFailure: ((err) => {
                    reject(err)
                })

            })

        })

    }

    async alterarSenhaUsuario(authAlterarSenhaUsuarioDto: AuthAlterarSenhaUsuarioDto) {

        const { email, senhaAtual, novaSenha } = authAlterarSenhaUsuarioDto

        const userData = {
            Username: email,
            Pool: this.userPool
        }

        const authenticationDetails = new AuthenticationDetails({
            Username: email,
            Password: senhaAtual
        })

        const cognitoUser = new CognitoUser(userData)

        return new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: () => {
                    cognitoUser.changePassword(senhaAtual, novaSenha, (err, result) => {
                        if (err) {
                            reject(err)
                            return
                        }
                        resolve(result)
                    })
                },
                onFailure: (err) => {
                    reject(err)
                }
            })
        })

    }

    //esquecerSenhaUsuario
    async esquecerSenhaUsuario(authEsquecerSenhaUsuarioDto: AuthEsquecerSenhaUsuarioDto) {

        const { email } = authEsquecerSenhaUsuarioDto

        const userData = {
            Username: email,
            Pool: this.userPool
        }

        const cognitoUser = new CognitoUser(userData)

        return new Promise((resolve, reject) => {
            cognitoUser.forgotPassword(
                {
                    onSuccess: (result) => {
                        resolve(result)
                    },
                    onFailure: ((err) => {
                        reject(err)
                    })
                }
            )
        })

    }

    //confirmarSenhaUsuario
    async confirmarSenhaUsuario(authConfirmarSenhaUsuarioDto: AuthConfirmarSenhaUsuarioDto) {

        const { email, codigoConfirmacao, novaSenha } = authConfirmarSenhaUsuarioDto

        const userData = {
            Username: email,
            Pool: this.userPool
        }

        const cognitoUser = new CognitoUser(userData)

        return new Promise((resolve, reject) => {
            cognitoUser.confirmPassword(codigoConfirmacao, novaSenha, {
                onSuccess: () => {
                    resolve({
                        status: 'sucesso'
                    })
                },
                onFailure: ((err) => {
                    reject(err)
                })
            })
        })

    }

    //https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ListUsers.html
    async consultarUsuario(usuario: string): Promise<any> {

        const parametros = {
            UserPoolId: this.authConfig.userPoolId,
            Filter: `email = '${usuario}'`
        }


        return new Promise((resolve, reject) => {

            AWS.config.update({
                region: this.authConfig.region,
                'accessKeyId': this.authConfig.AWS_ACCESS_KEY_ID,
                'secretAccessKey': this.authConfig.AWS_SECRET_ACCESS_KEY
            })

            const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider()

            cognitoIdentityServiceProvider.listUsers(parametros, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    console.log("data", data)
                    resolve(data)
                }
            })

        })

    }


}