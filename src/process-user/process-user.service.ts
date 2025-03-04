import { Injectable } from '@nestjs/common';
import { CreateProcessUserDto } from './dto/create-process-user.dto';
import { UpdateProcessUserDto } from './dto/update-process-user.dto';

@Injectable()
export class ProcessUserService {
  create(createProcessUserDto: CreateProcessUserDto) {
    return 'This action adds a new processUser';
  }

  findAll() {
    return `This action returns all processUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} processUser`;
  }

  update(id: number, updateProcessUserDto: UpdateProcessUserDto) {
    return `This action updates a #${id} processUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} processUser`;
  }
}
