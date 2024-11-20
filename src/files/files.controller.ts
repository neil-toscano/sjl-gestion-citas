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

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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
        destination: './static/pdf', // Asegúrate de tener este directorio para almacenar PDFs
        filename: fileNamer,
      }),
    }),
  )
  uploadDocumentPDF(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is a PDF');
    }

    const fileUrl = `${file.filename}`;

    return { fileUrl };
  }

  @Get('pdf/:pdfName')
  getFile(@Res() res: Response, @Param('pdfName') pdfName: string) {
    const path = this.filesService.getFile(pdfName);

    res.sendFile(path);
  }
}
