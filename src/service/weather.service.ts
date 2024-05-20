import { Provide, makeHttpRequest } from '@midwayjs/core';
import { IWeatherInfo } from '../interface';
import {WeatherEmptyDataError} from '../error/weather.error';

@Provide()
export class WeatherService {
  async getWeather(cityId: string): Promise<IWeatherInfo> {
    if (!cityId) {
      throw new WeatherEmptyDataError();
    }

    try {
      const result = await makeHttpRequest<IWeatherInfo>(`https://midwayjs.org/resource/${cityId}.json`, {
        dataType: 'json',
      });
      if (result.status === 200) {
        return result.data as IWeatherInfo;
      }
    } catch (error) {
      throw new WeatherEmptyDataError(error);
    }
  }
}
