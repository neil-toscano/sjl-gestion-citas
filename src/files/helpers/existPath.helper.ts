import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

export const validateFolderExists = (folderPath: string): void => {
    if (!fs.existsSync(folderPath)) {
      throw new BadRequestException(`La carpeta no existe, crea primero dicha carpeta`);
    }
  };