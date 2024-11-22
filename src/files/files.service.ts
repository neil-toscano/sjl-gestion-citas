import { existsSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FilesService {
  constructor() {}

  // getFile(filename: string) {
  //   // const path = join(__dirname, '../../static/pdf', filename);
  //   const path = join('http://172.16.23.11/DATOS/BACKUP TAREAJE', 'sistema_fisca', filename);

  //   if (!existsSync(path))
  //     throw new BadRequestException(`No file(pdf) found with name ${filename}`);
  //   return path;
  // }

  getFile(filename: string): string {
    // Validar que el nombre sea seguro (opcional)
    if (!/^[a-zA-Z0-9._-]+\.pdf$/.test(filename)) {
      throw new BadRequestException('Invalid file name');
    }

    // Construir la ruta completa
    const path = join(
      '\\\\172.16.23.11\\DATOS\\BACKUP TAREAJE',
      'sistema_fisca',
      filename
    );

    // Verificar si el archivo existe
    if (!existsSync(path)) {
      throw new BadRequestException(`No file (PDF) found with name ${filename}`);
    }

    return path; // Devolver la ruta completa
  }

  deleteFile(filename: string) {
    const filePath = join(__dirname, '../../static/pdf', filename);

    if (!existsSync(filePath)) {
      throw new BadRequestException(`Archivo no encontrado, inténtelo mas tarde`);
    }

    try {
      unlinkSync(filePath);
      return { message: `File ${filename} deleted successfully` };
    } catch (error) {
      console.log(error.message, filename);
      throw new BadRequestException(`Error al encontrar el archivo`);
    }
  }

  async getAllPdfFiles() {
    const pdfDirectory = join(__dirname, '../../static/pdf');

    if (!existsSync(pdfDirectory)) {
      throw new BadRequestException(`Directory not found: ${pdfDirectory}`);
    }

    const files = readdirSync(pdfDirectory);

    const pdfFiles = files.filter((file) => file.endsWith('.pdf'));

    return pdfFiles;
  }
}
