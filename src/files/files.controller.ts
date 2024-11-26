import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Res,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';

import { fileFilter, fileNamer } from './helpers';
import { Auth } from 'src/auth/decorators';
import { access, constants, existsSync, readdirSync, readFileSync } from 'fs';
import { validateFolderExists } from './helpers/existPath.helper';
import { ValidRoles } from 'src/auth/interfaces';
import * as path from 'path';
import * as fs from 'fs';

import { v4 as uuid } from 'uuid';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('pdf')
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocumentPDF(@UploadedFile() file: Express.Multer.File) {
    if (!file || file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Make sure that the file is a PDF');
    }

    let folderPath = String(process.env.FILE_URL_SERVER).trim();
    const subFolder = 'PDF';
    folderPath = path.join(folderPath, subFolder);

    if (!fs.existsSync(folderPath)) {
      console.error(`EL DIRECTORIO NO EXISTE: ${folderPath}`);
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Directorio creado: ${folderPath}`);
    }

    const fileName = `${uuid()}.pdf`;

    let filePath = path.join(folderPath, fileName);

    fs.writeFile(filePath, file.buffer, (err) => {
      if (err) {
        console.error('Error al guardar el archivo:', err.message);
        throw new BadRequestException('Error al guardar el archivo');
      } else {
        console.log('Archivo guardado exitosamente en:', filePath);
      }
    });

    return { fileUrl: fileName };
  }

  @Get('pdf/:pdfName')
  getFile(@Res() res: Response, @Param('pdfName') pdfName: string) {
    return this.filesService.getFile(pdfName, res);
  }

  @Post('crear-archivo')
  @Auth()
  crearArchivo() {
    const sharedDir = String(process.env.FILE_URL_SERVER).trim();

    fs.access(sharedDir, fs.constants.W_OK, (err) => {
      if (err) {
        console.error('No se puede acceder al directorio compartido:', err.message);
        throw new BadRequestException('No se puede acceder al recurso compartido');
      } else {
        console.log('El directorio es accesible para escritura.');

        const filePath = path.join(sharedDir, 'nuevo_archivo.txt');
        const data = 'Este es un archivo creado desde Node.js.';

        fs.writeFile(filePath, data, (err) => {
          if (err) {
            console.error('Error al guardar el archivo:', err.message);
            throw new BadRequestException('Error al guardar el archivo');
          } else {
            console.log('Archivo guardado exitosamente en:', filePath);
          }
        });
      }
    });
  }
  
  @Get('list')
  @Auth(ValidRoles.admin)
  getFileList() {
    return this.filesService.getFileList();
  }

  @Delete('pdf/:pdfName')
  @Auth()
  deleteFile(@Param('pdfName') pdfName: string) {
    return this.filesService.deleteFile(pdfName);
  }
}
