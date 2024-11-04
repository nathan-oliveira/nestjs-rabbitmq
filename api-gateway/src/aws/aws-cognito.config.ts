import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsCognitoConfig {

    constructor(
        private configService: ConfigService
    ) { }

    public userPoolId: string = this.configService.get<string>('COGNITO_USER_POOL_ID');
    public clientId: string = this.configService.get<string>('COGNITO_CLIENT_ID');
    public region: string = this.configService.get<string>('AWS_REGION_VIRGINIA');
    public authority = `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}`;
    public AWS_ACCESS_KEY_ID = this.configService.get<string>(
        'AWS_ACCESS_KEY_ID',
    );
    public AWS_SECRET_ACCESS_KEY = this.configService.get<string>(
        'AWS_SECRET_ACCESS_KEY',
    );

}