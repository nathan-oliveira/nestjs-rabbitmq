import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RankingsService } from './rankings.service';

@Controller('api/v1/rankings')
export class RankingsController {
  constructor(private rankingsService: RankingsService) {}

  @Get()
  consultarRankings(
    @Query('idCategoria') idCategoria: string,
    @Query('dataRef') dataRef: string,
  ): Observable<any> {
    return this.rankingsService.consultarRankings(idCategoria, dataRef);
  }
}
