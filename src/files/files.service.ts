import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FilesService {
  constructor() {}

  getFile(filename: string) {
    const path = join(__dirname, '../../static/pdf', filename);
    if (!existsSync(path))
      throw new BadRequestException(`No file(pdf) found with name ${filename}`);
    return path;
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
}
