import { existsSync, readdirSync, unlinkSync } from 'fs';
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
      throw new BadRequestException(`No file found with name ${filename}`);
    }

    try {
      unlinkSync(filePath);
      return { message: `File ${filename} deleted successfully` };
    } catch (error) {
      throw new BadRequestException(`Error deleting file: ${error.message}`);
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
