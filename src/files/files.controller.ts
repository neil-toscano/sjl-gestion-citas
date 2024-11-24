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

function getFileExtension(filename) {
  const ext = filename.substring(filename.lastIndexOf('.'));
  return ext ? ext.toLowerCase() : '';
}
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('pdf')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocumentPDF(@UploadedFile() file: Express.Multer.File) {

    if (!file || file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Make sure that the file is a PDF');
    }
  
    const folderPath = process.env.FILE_URL_SERVER;
  
    if (!fs.existsSync(folderPath)) {
    console.error(`EL DIRECTORIO NO EXISTE: ${folderPath}`);
    throw new BadRequestException(`EL DIRECTORIO NO EXISTE: ${folderPath}`);
  }
  
  
    const fileName = `${uuid()}.pdf`;
  
    let filePath = path.join(folderPath, fileName);
    filePath = filePath.replace(/[/\\](?=[^/\\]*$)/, '\\');
  
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
  crearArchivo() {
    const sharedDir = String(process.env.FILE_URL_SERVER).trim();
    fs.access(sharedDir, fs.constants.W_OK, (err) => {
      if (err) {
        console.error(
          'No se puede acceder al directorio compartido:',
          err.message,
        );
      } else {
        console.log('El directorio es accesible para escritura.');

        // Ejemplo de escritura de un archivo
        let filePath = path.join(sharedDir, 'nuevo_archivo.txt');
        filePath = filePath.replace(/[/\\](?=[^/\\]*$)/, '\\');
        console.log(filePath, 'filepath');
        const data = 'Este es un archivo creado desde Node.js.';

        fs.writeFile(filePath, data, (err) => {
          if (err) {
            console.error('Error al guardar el archivo:', err.message);
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
