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
      if (error.response) {
        if (error?.response?.data?.message) {
          throw new BadRequestException(
            error.response.data.message || 'Error desconocido',
          );
        }

        if (error?.response?.data?.errors?.numero_documento) {
          throw new BadRequestException(
            error.response.data.errors.numero_documento[0] ||
              'Error desconocido',
          );
        } else if (error?.response?.data?.errors?.correo) {
          throw new BadRequestException(
            error.response.data.errors.correo[0] || 'Error desconocido',
          );
        } else if (error?.response?.data?.errors?.contrasena) {
          throw new BadRequestException(
            error.response.data.errors.contrasena[0] || 'Error desconocido',
          );
        } else if (error?.response?.data?.errors?.codigo) {
          throw new BadRequestException(
            error.response.data.errors.codigo[0] || 'Error desconocido',
          );
        }
        throw new BadRequestException(
          error.response?.data?.error || 'Error desconocido',
        );
      }
      throw new InternalServerErrorException('Error de conexión');
    }
  }
}
