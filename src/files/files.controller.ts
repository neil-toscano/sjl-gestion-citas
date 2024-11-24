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

function getFileExtension(filename) {
    const ext = filename.substring(filename.lastIndexOf('.'));
    return ext ? ext.toLowerCase() : '';
}
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('pdf')
  // @Auth()
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
        destination: function (req, file, cb) {
          cb(null, '\destination')
        },
        filename: fileNamer,
      }),
    }),
  )
  uploadDocumentPDF(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      console.log(file, 'file');
      throw new BadRequestException('Make sure that the file is a PDF');
    }
    const fileUrl = `${file.filename}`;
    return { fileUrl };
  }
  



  @Get('pdf/:pdfName')
  getFile(@Res() res: Response, @Param('pdfName') pdfName: string) {
    return this.filesService.getFile(pdfName, res);
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
