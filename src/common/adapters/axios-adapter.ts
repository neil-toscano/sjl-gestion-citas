import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;
  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url);
      return data;
    } catch (error) {
      throw new Error('this is an error-check logs');
    }
  }

  async post<T>(
    url: string,
    payload: any,
    header = { 'Content-Type': 'application/json' },
  ): Promise<T | { status: boolean; error?: string }> {
    try {
      const { data } = await this.axios.post<T>(url, payload, {
        headers: header,
      });
      return {
        ...data,
        status: true,
      };
    } catch (error: any) {
      console.log(error.message, 'error-message');
      if (error.response) {
        console.log(error.response.data, 'error-data');
        throw new BadRequestException(
          error.response.data || 'Error desconocido',
        );
      }
      throw new InternalServerErrorException('Error de conexión');
    }
  }
}
