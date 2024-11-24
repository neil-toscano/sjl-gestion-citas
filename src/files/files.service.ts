import { existsSync, readdirSync, unlinkSync } from 'fs';
import * as path from 'path';
import * as fs from 'fs';

import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FilesService {
  constructor() {}

  getFile(filename: string, res: any) {
    const FILE_URL_SERVER = String(process.env.FILE_URL_SERVER).trim();

    let filePath = path.join(FILE_URL_SERVER, filename);
    filePath = filePath.replace(/[/\\](?=[^/\\]*$)/, '\\');

    if (!existsSync(filePath))
      throw new BadRequestException(`Pdf no encontrado ${filename}`);

    res.sendFile(filePath, (err: any) => {
      if (err) {
        throw new BadRequestException(`error al enviar pdf: ${err.message}`);
      }
    });
  }

  deleteFile(filename: string) {
    const FILE_URL_SERVER = process.env.FILE_URL_SERVER;

    if (!FILE_URL_SERVER) {
      throw new BadRequestException(
        'La ruta de almacenamiento no está configurada.',
      );
    }

    const filePath = path.join(FILE_URL_SERVER, filename);

    if (!fs.existsSync(filePath)) {
      throw new BadRequestException(
        `Archivo ${filename} no encontrado, inténtelo más tarde`,
      );
    }

    try {
      fs.unlinkSync(filePath);
      return { message: `El archivo ${filename} se eliminó correctamente` };
    } catch (error) {
      console.error(`Error al eliminar el archivo: ${error.message}`);
      throw new BadRequestException(
        `Error al intentar eliminar el archivo ${filename}`,
      );
    }
  }

  getFileList() {
    const FILE_URL_SERVER = process.env.FILE_URL_SERVER;

    if (!FILE_URL_SERVER) {
      throw new BadRequestException(
        'La ruta de almacenamiento no está configurada.',
      );
    }

    if (!fs.existsSync(FILE_URL_SERVER)) {
      throw new BadRequestException(
        'El directorio de almacenamiento no existe.',
      );
    }

    try {
      const files = fs.readdirSync(FILE_URL_SERVER);
      return {
        files: files.filter((file) =>
          fs.lstatSync(path.join(FILE_URL_SERVER, file)).isFile(),
        ),
      };
    } catch (error) {
      console.error(`Error al listar archivos: ${error.message}`);
      throw new BadRequestException('Error al intentar listar los archivos.');
    }
  }

  async getAllPdfFiles() {
    const pdfDirectory = path.join(__dirname, '../../static/pdf');

    if (!existsSync(pdfDirectory)) {
      throw new BadRequestException(`Directory not found: ${pdfDirectory}`);
    }

    const files = readdirSync(pdfDirectory);

    const pdfFiles = files.filter((file) => file.endsWith('.pdf'));

    return pdfFiles;
  }
}
