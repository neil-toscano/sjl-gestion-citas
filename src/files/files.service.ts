import { existsSync } from 'fs';
import { join } from 'path';

import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { CreateDocumentDto } from 'src/documents/dto/create-document.dto';

@Injectable()
export class FilesService {
  constructor() {

  }

  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../static/products', imageName);

    if (!existsSync(path))
      throw new BadRequestException(`No product found with image ${imageName}`);

    return path;
  }

  getFile(filename: string){
    const path = join(__dirname, '../../static/pdf', filename);

    if (!existsSync(path))
      throw new BadRequestException(`No product found with image ${filename}`);
    return path;
  }
}
