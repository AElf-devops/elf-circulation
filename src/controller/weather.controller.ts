import {Controller, Get, Inject, Query, RequestIP} from '@midwayjs/core';
import {WeatherService} from '../service/weather.service';
import {IWeatherInfo} from '../interface';
import {Context} from '@midwayjs/koa';

@Controller('/')
export class WeatherController {
  // Demo: http://127.0.0.1:7001/weather?cityId=101010100
  @Inject()
  weatherService: WeatherService;
  // This is a decorator, define a route.
  @Get('/weather')
  async getWeatherInfo(@Query('cityId') cityId: string): Promise<IWeatherInfo> {
    // The return of http; can be a string, number, JSON, Buffer, etc.
    return this.weatherService.getWeather(cityId);
  }
  // async getWeatherInfo(@Query('cityId') cityId: string): Promise<string> {
  //   // The return of http; can be a string, number, JSON, Buffer, etc.
  //   // return `Hello ${cityId}  Weather!`;
  // }
  @Inject()
  ctx: Context;
  @Get('/weather/ip')
  async getIP(@RequestIP() ip: string) {
    return {
      ctxIp: this.ctx.ip,
      reqIp: ip
    };
  }
}
