import { Controller, Get, Inject, Query } from '@midwayjs/core';
import { TokenService } from '../service/token.service';
import { ITokenInfo } from '../interface/token.interface';

@Controller('/token')
export class WeatherController {
  @Inject()
  tokenService: TokenService;

  @Get('/infoT')
  async getTokenInfoTest(@Query('symbol') symbol: string): Promise<any> {
    return this.tokenService.getTokenInfo(symbol);
  }
  @Get('/info')
  async getTokenInfo(@Query('symbol') symbol: string): Promise<ITokenInfo> {
    return {
      supply: {
        aelf: '1'
      },
      destroy: {
        aelf: '1',
      },
      organizationBalance: {
        aelf: {
          all: '1',
          notConvert: '1',
          foundation: '1'
        }
      }
    }
  }
}
