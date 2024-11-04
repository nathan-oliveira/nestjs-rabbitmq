import { BadRequestException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';

@Injectable()
export class RankingsService {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientRankingsBackend = this.clientProxySmartRanking.getClientProxyRankingsInstance();

  consultarRankings(idCategoria: string, dataRef: string): Observable<any> {
    if (!idCategoria) {
      throw new BadRequestException('O id da categoria é obrigatório!');
    }

    return this.clientRankingsBackend.send('consultar-rankings', {
      idCategoria: idCategoria,
      dataRef: dataRef ? dataRef : '',
    });
  }
}
