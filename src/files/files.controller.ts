import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';

import { fileFilter, fileNamer } from './helpers';
import { Auth } from 'src/auth/decorators';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // @Post('pdf')
  // @Auth()
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     fileFilter: (req, file, callback) => {
  //       if (!file.originalname.match(/\.(pdf)$/)) {
  //         return callback(
  //           new BadRequestException('Only PDF files are allowed!'),
  //           false,
  //         );
  //       }
  //       callback(null, true);
  //     },
  //     storage: diskStorage({
  //       // destination: './static/pdf', // Asegúrate de tener este directorio para almacenar PDFs
  //       destination: 'http://172.16.23.11/DATOS/BACKUP TAREAJE/sistema_fisca', // Asegúrate de tener este directorio para almacenar PDFs
  //       filename: fileNamer,
  //     }),
  //   }),
  // )
  // uploadDocumentPDF(@UploadedFile() file: Express.Multer.File) {
  //   if (!file) {
  //     throw new BadRequestException('Make sure that the file is a PDF');
  //   }

  //   const fileUrl = `${file.filename}`;

  //   return { fileUrl };
  // }

@Post('pdf')
@Auth()
@UseInterceptors(
  FileInterceptor('file', {
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(pdf)$/)) {
        return callback(
          new BadRequestException('Only PDF files are allowed!'),
          false,
        );
      }
      callback(null, true);
    },
    storage: diskStorage({
      // Ruta de red válida para guardar el archivo
      destination: '\\172.16.23.11\\DATOS\\BACKUP TAREAJE\\gestion_citas',
      filename: (req, file, callback) => {
        const timestamp = Date.now(); // Evitar colisiones usando un timestamp
        const uniqueName = `${timestamp}-${file.originalname}`;
        callback(null, uniqueName);
      },
    }),
  }),
)
uploadDocumentPDF(@UploadedFile() file: Express.Multer.File) {
  if (!file) {
    throw new BadRequestException('Make sure that the file is a PDF');
  }

  // Devolver la ruta completa donde se guardó el archivo
  const filePath = `\\\\172.16.23.11\\DATOS\\BACKUP TAREAJE\\gestion_citas\\${file.filename}`;

  return { message: 'Archivo subido exitosamente', filePath };
}



  // @Get('pdf/:pdfName')
  // getFile(@Res() res: Response, @Param('pdfName') pdfName: string) {
  //   const path = this.filesService.getFile(pdfName);

  //   res.sendFile(path);
  // }
  @Get('pdf')
listPdfs() {
  // Ruta de la carpeta compartida
  const directoryPath = '\\172.16.23.11\\DATOS\\BACKUP TAREAJE\\gestion_citas';

  try {
    // Leer el contenido del directorio
    const files = readdirSync(directoryPath);

    // Filtrar para asegurarnos de que sean solo archivos PDF
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));

    return { message: 'Archivos encontrados', files: pdfFiles };
  } catch (error) {
    throw new BadRequestException('Error al leer la carpeta o no se encontró');
  }
}

@Get('pdf/:pdfName')
getPdfByName(@Param('pdfName') pdfName: string, @Res() res: Response) {
  // Ruta de la carpeta compartida
  const directoryPath = '\\\\172.16.23.11\\DATOS\\BACKUP TAREAJE\\gestion_citas';

  try {
    // Leer el contenido del directorio
    const files = readdirSync(directoryPath);

    // Buscar el archivo específico que coincida con el nombre
    const pdfFile = files.find(file => file === pdfName);

    if (!pdfFile) {
      throw new BadRequestException(`No se encontró el archivo: ${pdfName}`);
    }

    // Construir la ruta completa del archivo
    const filePath = join(directoryPath, pdfFile);

    // Enviar el archivo PDF al cliente
    res.sendFile(filePath, (err) => {
      if (err) {
        throw new BadRequestException('Error al enviar el archivo');
      }
    });

  } catch (error) {
    console.log(error);
    throw new BadRequestException('Error al leer la carpeta o no se encontró el archivo');
  }
}


}



