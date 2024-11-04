import { Module } from '@nestjs/common';
import { JogadoresController } from './jogadores.controller';
import { ProxyRMQModule } from '../proxyrmq/proxyrmq.module'
import { AwsModule } from '../aws/aws.module'
import { JogadoresService } from './jogadores.service';

@Module({
  imports: [ProxyRMQModule, AwsModule],  
  controllers: [JogadoresController], providers: [JogadoresService]
})
export class JogadoresModule {}
