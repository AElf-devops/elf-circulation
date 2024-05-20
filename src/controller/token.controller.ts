import { Controller, Get, Inject, Query } from '@midwayjs/core';
import { TokenService } from '../service/token.service';
import { ITokenInfo } from '../interface/token.interface';
import {TokenEmptyDataError} from '../error/token.error';

@Controller('/token')
export class WeatherController {
  @Inject()
  tokenService: TokenService;

  @Get('/info')
  async getTokenInfo(
    @Query('symbol') symbol: string,
    @Query('cal') cal?: string,
  ): Promise<ITokenInfo> {
    if (symbol !== 'ELF') {
      throw new TokenEmptyDataError();
    }
    return this.tokenService.getTokenInfo(symbol, cal);
  }
}
