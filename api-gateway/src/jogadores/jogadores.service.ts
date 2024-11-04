import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';
import { AwsS3Service } from '../aws/aws-s3.service';
import { Jogador } from '../jogadores/interfaces/jogador.interface';
import { Categoria } from '../categorias/interfaces/categoria.interface';

@Injectable()
export class JogadoresService {
  private logger = new Logger(JogadoresService.name);

  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private awsS3Service: AwsS3Service,
  ) {}

  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  async criarJogador(criarJogadorDto: CriarJogadorDto) {
    this.logger.log(`criarJogadorDto: ${JSON.stringify(criarJogadorDto)}`);

    const categoria: Categoria = await this.clientAdminBackend
      .send('consultar-categorias', criarJogadorDto.categoria)
      .toPromise();

    if (categoria) {
      await this.clientAdminBackend.emit('criar-jogador', criarJogadorDto);
    } else {
      throw new BadRequestException(`Categoria não cadastrada!`);
    }
  }

  async uploadArquivo(file, _id: string) {
    //Verificar se o jogador está cadastrado
    const jogador: Jogador = await this.clientAdminBackend
      .send('consultar-jogadores', _id)
      .toPromise();

    if (!jogador) {
      throw new BadRequestException(`Jogador não encontrado!`);
    }

    //Enviar o arquivo para o S3 e recuperar a URL de acesso
    const urlFotoJogador: {
      url: string;
    } = await this.awsS3Service.uploadArquivo(file, _id);

    //Atualizar o atributo URL da entidade jogador
    const atualizarJogadorDto: AtualizarJogadorDto = {};
    atualizarJogadorDto.urlFotoJogador = urlFotoJogador.url;

    await this.clientAdminBackend.emit('atualizar-jogador', {
      id: _id,
      jogador: atualizarJogadorDto,
    });

    //Retornar o jogador atualizado para o cliente
    return this.clientAdminBackend.send('consultar-jogadores', _id);
  }

  consultarJogadores(_id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-jogadores', _id ? _id : '');
  }

  async atualizarJogador(
    atualizarJogadorDto: AtualizarJogadorDto,
    _id: string,
  ) {
    const categoria: Categoria = await this.clientAdminBackend
      .send('consultar-categorias', atualizarJogadorDto.categoria)
      .toPromise();

    if (categoria) {
      await this.clientAdminBackend.emit('atualizar-jogador', {
        id: _id,
        jogador: atualizarJogadorDto,
      });
    } else {
      throw new BadRequestException(`Categoria não cadastrada!`);
    }
  }

  async deletarJogador(_id: string) {
    await this.clientAdminBackend.emit('deletar-jogador', { _id });
  }
}
